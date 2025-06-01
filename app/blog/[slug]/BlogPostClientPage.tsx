"use client";

import { useState, useEffect, Suspense } from 'react';

// REMOVE: import { getBlogPosts, getBlogPost } from '@/app/db/blog';
// These are now fetched via API
import { getViewsCount } from '@/app/db/queries'; // For ClientViews
import BlogPostSkeleton from './loading';
import { Skeleton } from '@/app/components/ui/skeleton';
import { CustomMDX } from '@/app/components/ui/mdx';
import ViewCounter from '../view-counter';
import { increment } from '@/app/db/actions';
// import { unstable_noStore as noStore } from 'next/cache'; // noStore call was removed from formatDate

import type { MDXRemoteSerializeResult } from 'next-mdx-remote'; // Add this import

// Post interface
interface Post {
  blogId: string;
  slug: string;
  title: string;
  publishedAt: string;
  mdxSource: MDXRemoteSerializeResult; // Expect the serialized MDX object
  description?: string; // Keep existing optional fields like description
  [key: string]: any; // Keep for other properties
}

// formatDate function
function formatDate(date: string) {
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

      if (!params.slug) {
        setError("No slug provided.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/blog-posts/${params.slug}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `Error fetching post: ${response.statusText}` }));
          throw new Error(errorData.message || `Error fetching post: ${response.statusText}`);
        }
        const data: Post = await response.json();
        setPostData(data);
      } catch (e: any) {
        console.error("Failed to fetch blog post:", e);
        setError(e.message || "An error occurred while fetching the post.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  if (isLoading) return <BlogPostSkeleton />;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!postData) return <div className="p-4">Post not found or no slug provided.</div>;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://danielsaisani.com';

  return (
    <section className="animate-fadeIn">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: postData.title,
            datePublished: postData.publishedAt,
            dateModified: postData.publishedAt, // Or use a separate modifiedDate field if available
            description: postData.description || postData.title, // Assuming a description field or fallback to title
            image: `${siteUrl}/og?title=${encodeURIComponent(postData.title)}`, // General OG image
            url: `${siteUrl}/blog/${postData.slug}`,
            author: {
              '@type': 'Person',
              name: 'Daniel Saisani', // This could also be from env or config
            },
          }),
        }}
      />
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
        {postData.mdxSource ? (
          <CustomMDX mdxSource={postData.mdxSource} />
        ) : (
          <p>Error loading content or content is empty.</p>
          // Or some other appropriate fallback if mdxSource is null/undefined
          // This might happen if serialization failed on the server and API returned null for mdxSource
        )}
      </article>
    </section>
  );
}
