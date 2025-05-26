'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { Skeleton } from '@/app/components/ui/skeleton';
import ViewCounter from './view-counter'; // Corrected import path
import { LottieAnimation } from '@/app/components/ui/lottie'; // Added LottieAnimation import
// Assuming the path for your Lottie JSON, adjust if necessary
// import animationData from '@/public/lottie/blog-animation.json'; 

// Interfaces
// This interface matches the structure returned by our /api/blogs endpoint
interface ApiPost {
  id: string; // This is the documentId from Strapi
  title: string;
  slug: string;
  publishedAt: string | null; // ISO date string, or null if not published
  // Add any other fields that /api/blogs returns and you need
  // For example: description, content, date, image, etc.
}

// For client-side state, we can use a slightly more specific type if needed,
// but ApiPost might be sufficient. Let's define them for clarity.
interface PublishedPost extends ApiPost {
  publishedAt: string; // Ensure publishedAt is a string for published posts
}

interface UpcomingPost extends ApiPost {
  // publishedAt could be null or a future date string
}

// Define the structure for a single view count item
interface ViewCount {
  slug: string;
  count: number;
}

// Define the props for BlogList component
interface BlogListProps {
  allViews: ViewCount[];
}

export default function BlogList({ allViews }: BlogListProps) {
  const [posts, setPosts] = useState<PublishedPost[]>([]);
  const [comingSoonPosts, setComingSoonPosts] = useState<UpcomingPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      // setIsLoading(true); // Already true on initial load, useful for refresh
      try {
        const response = await fetch('/api/blogs');
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        const result = await response.json();
        const allPosts: ApiPost[] = result.response?.data || [];

        const now = new Date();
        const published: PublishedPost[] = [];
        const upcoming: UpcomingPost[] = [];

        allPosts.forEach(post => {
          if (post.publishedAt) {
            const publishedDate = new Date(post.publishedAt);
            if (publishedDate <= now) {
              published.push(post as PublishedPost); // Cast because we've checked publishedAt
            } else {
              // PublishedAt is in the future
              upcoming.push(post);
            }
          } else {
            // No publishedAt date, so it's upcoming
            upcoming.push(post);
          }
        });

        setPosts(published);
        setComingSoonPosts(upcoming);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch blog posts:", err);
        setError("Failed to load blog posts. Please try again later.");
        setPosts([]);
        setComingSoonPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          // Container for each skeleton item. No animate-pulse here.
          <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            {/* Title Skeleton: Added rounded-lg, opacity-75, and specific bg colors */}
            <Skeleton className="h-6 w-3/4 mb-3 rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" /> 
            {/* Metadata Line Skeleton (Date + ViewCounter) */}
            <div className="flex justify-between items-center mt-2">
              {/* Date part: Added rounded-lg, opacity-75, and specific bg colors */}
              <Skeleton className="h-4 w-1/3 rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" /> 
              {/* ViewCounter part: Added rounded-lg, opacity-75, and specific bg colors */}
              <Skeleton className="h-4 w-1/4 rounded-lg opacity-75 bg-gray-300 dark:bg-gray-700" /> 
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Published Posts</h2>
      {posts.length > 0 ? (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.id} className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <Link href={`/blog/${post.slug}`} className="block">
                {/* Changed dark mode title color to white */}
                <h3 className="text-xl font-semibold text-blue-600 dark:text-white hover:underline">{post.title}</h3>
                {/* Changed dark mode secondary text color to gray-300 */}
                <div className="text-sm text-gray-500 dark:text-gray-300 mt-1 flex justify-between items-center">
                  <span>Published on: {new Date(post.publishedAt).toLocaleDateString()}</span>
                  {/* Ensure ViewCounter is only rendered for posts with a slug */}
                  {post.slug && (
                    <Suspense fallback={<div className="h-5 w-16 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md"></div>}>
                      {/* Pass allViews to ViewCounter */}
                      <ViewCounter slug={post.slug} allViews={allViews} />
                    </Suspense>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No published posts yet. Check back soon!</p>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4">Coming Soon</h2>
      {comingSoonPosts.length > 0 ? (
        // Changed ul to div, Link items will manage their own margins
        <div> 
          {comingSoonPosts.map((post) => (
            <Link 
              key={post.id || post.title} 
              href={`/blog`} // Links to the main blog page
              className="flex flex-col space-y-1 mb-4" // Styling from prompt
            >
              <div className="w-full flex flex-col hover:bg-gray-100 hover:translate-x-1 hover:bg-opacity-10 dark:hover:bg-gray-800 duration-200 rounded-md p-4 opacity-70">
                <p className="dark:text-neutral-100 tracking-tight">
                  {post.title}
                </p>
                <Suspense fallback={<div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>}> {/* Fallback from prompt, removed animate-pulse as not specified */}
                  <LottieAnimation width={30} height={30} type={'writing'} />
                </Suspense>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Coming Soon...</p> {/* Added mt-1 for spacing similar to published posts */}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No upcoming posts announced yet.</p>
      )}
    </div>
  );
}
