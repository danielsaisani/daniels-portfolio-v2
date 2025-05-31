"use client";

import { useState, useEffect, Suspense } from 'react';
// import { notFound } from 'next/navigation'; // notFound is for server components; client uses setError

// Assuming these are correctly imported from their locations
import { getBlogPosts, getBlogPost } from '@/app/db/blog';
import { getViewsCount } from '@/app/db/queries'; // For ClientViews
import BlogPostSkeleton from './skeleton';
import { Skeleton } from '@/app/components/ui/skeleton';
import { CustomMDX } from '@/app/components/ui/mdx';
import ViewCounter from '../view-counter';
import { increment } from '@/app/db/actions';
// import { cache } from 'react'; // Removed as unused
// import { unstable_noStore as noStore } from 'next/cache'; // Removed as noStore call is removed

// Post interface
interface Post {
  blogId: string;
  slug: string;
  title: string;
  publishedAt: string;
  blocks: Array<{ body: string }>;
  [key: string]: any;
}

// formatDate function
function formatDate(date: string) {
  // noStore(); // Removed noStore call as this is now client-side logic
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

// ClientViews Component
interface ClientViewsProps {
  slug: string;
}

function ClientViews({ slug }: ClientViewsProps) {
  const [allViewsData, setAllViewsData] = useState<any[] | null>(null);

  useEffect(() => {
    increment(slug); // Server action

    const fetchViews = async () => {
      try {
        const views = await getViewsCount(); // Assumed callable from client
        setAllViewsData(views);
      } catch (error) {
        console.error("Failed to fetch view counts:", error);
        setAllViewsData([]);
      }
    };
    fetchViews();
  }, [slug]);

  return <ViewCounter slug={slug} allViews={allViewsData} />;
}

// Main Client Component
export default function BlogPostClientPage({ params }: { params: { slug: string } }) {
  const [postData, setPostData] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setPostData(null);
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
          title: rawPostData.title || "Untitled",
          publishedAt: rawPostData.publishedAt || new Date().toISOString(),
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
    } else {
      setError("No slug provided.");
      setIsLoading(false);
    }
  }, [params.slug]);

  if (isLoading) return <BlogPostSkeleton />;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!postData) return <div className="p-4">Post not found or no slug provided.</div>;

  return (
    <section className="animate-fadeIn">
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {postData.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(postData.publishedAt)}
        </p>
        <ClientViews slug={postData.slug} />
      </div>
      <article className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none">
        <CustomMDX source={postData.blocks[0]?.body || ''} />
      </article>
    </section>
  );
}
