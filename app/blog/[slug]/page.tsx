"use client";

import type { Metadata } from 'next';
import { useState, useEffect, Suspense, cache } from 'react';

import { getBlogPosts, getBlogPost } from '@/app/db/blog';
import { getViewsCount } from '@/app/db/queries';
import ViewCounter from '../view-counter';
import { increment } from '@/app/db/actions';
import { unstable_noStore as noStore } from 'next/cache';

import BlogPostSkeleton from './skeleton';
import { Skeleton } from '@/app/components/ui/skeleton';
import { CustomMDX } from '@/app/components/ui/mdx';

interface Post {
  blogId: string;
  slug: string;
  title: string;
  publishedAt: string;
  blocks: Array<{ body: string }>;
  [key: string]: any;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata | undefined> {
  const allPostsMeta = await getBlogPosts();
  const metaForPost = allPostsMeta?.find(p => p.slug === params.slug);

  if (!metaForPost || !metaForPost.blogId) {
    return { title: "Blog Post Not Found" };
  }
  const postDataForMeta = await getBlogPost(metaForPost.blogId);
  if (!postDataForMeta) {
    return { title: "Blog Post Data Not Found" };
  }
  const finalPostData = { ...postDataForMeta, slug: metaForPost.slug };
  return {
    title: finalPostData.title,
    openGraph: {
      title: finalPostData.title,
      type: 'article',
      publishedTime: finalPostData.publishedAt,
      url: `https://danielsaisani.com/blog/${finalPostData.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: finalPostData.title,
    },
  };
}

function formatDate(date: string): string {
  noStore();
  let currentDate = new Date().getTime();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date).getTime();
  let timeDifference = Math.abs(currentDate - targetDate);
  let daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  let fullDate = new Date(date).toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (daysAgo < 1) {
    return 'Today';
  } else if (daysAgo < 7) {
    return `${fullDate} (${daysAgo}d ago)`;
  } else if (daysAgo < 30) {
    const weeksAgo = Math.floor(daysAgo / 7);
    return `${fullDate} (${weeksAgo}w ago)`;
  } else if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30);
    return `${fullDate} (${monthsAgo}mo ago)`;
  } else {
    const yearsAgo = Math.floor(daysAgo / 365);
    return `${fullDate} (${yearsAgo}y ago)`;
  }
}

interface ClientViewsProps {
  slug: string;
}

function ClientViews({ slug }: ClientViewsProps) {
  const [allViewsData, setAllViewsData] = useState<any[] | null>(null);

  useEffect(() => {
    // Increment views using server action
    increment(slug);

    // Fetch all view counts
    const fetchViews = async () => {
      try {
        // IMPORTANT: This assumes getViewsCount() can be called client-side.
        // In a production app, this might need to be an API call if getViewsCount directly accesses a database.
        const views = await getViewsCount();
        setAllViewsData(views);
      } catch (error) {
        console.error("Failed to fetch view counts:", error);
        // Optionally set an error state for views
        setAllViewsData([]); // Set to empty array on error to prevent ViewCounter from breaking
      }
    };

    fetchViews();
  }, [slug]);

  return <ViewCounter slug={slug} allViews={allViewsData} />;
}


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [postData, setPostData] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allPostsMetaData = await getBlogPosts();
        const blogMetaData = allPostsMetaData?.find(p => p.slug === params.slug);

        if (!blogMetaData || !blogMetaData.blogId) {
          setError("Post not found.");
          setIsLoading(false);
          return;
        }

        const rawPostData = await getBlogPost(blogMetaData.blogId);
        if (!rawPostData) {
          setError("Post data could not be loaded.");
          setIsLoading(false);
          return;
        }

        const finalPostData: Post = {
          ...rawPostData,
          blogId: blogMetaData.blogId,
          slug: blogMetaData.slug,
          title: rawPostData.title || blogMetaData.title,
          publishedAt: rawPostData.publishedAt,
          blocks: rawPostData.blocks || [],
        };
        setPostData(finalPostData);

      } catch (e: any) {
        console.error("Failed to fetch blog post:", e);
        setError(e.message || "An error occurred while fetching the post.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchData();
    }
  }, [params.slug]);

  if (isLoading) return <BlogPostSkeleton />;
  if (error) return <div>Error: {error}</div>;
  if (!postData) return <div>Post not found.</div>;

  return (
    <section>
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {postData.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <p className="text-sm">
          {formatDate(postData.publishedAt)}
        </p>
        <ClientViews slug={postData.slug} />
      </div>
      <article className="pb-20">
        <CustomMDX source={postData.blocks && postData.blocks.length > 0 ? postData.blocks[0].body : ''} />
      </article>
    </section>
  );
}
