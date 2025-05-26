'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { Skeleton } from '@/app/components/ui/skeleton';
import ViewCounter from './view-counter'; // Corrected import path
// Assuming LottieAnimation is correctly pathed, adjust if necessary
// import LottieAnimation from '@/app/components/LottieAnimation'; 
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
          // Mimic the structure of a loaded list item (<li>)
          <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            {/* Title Skeleton */}
            <Skeleton className="h-6 w-3/4 mb-3" /> 
            {/* Metadata Line Skeleton (Date + ViewCounter) */}
            <div className="flex justify-between items-center mt-2">
              <Skeleton className="h-4 w-1/3" /> {/* Date part */}
              <Skeleton className="h-4 w-1/4" /> {/* ViewCounter part */}
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
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline">{post.title}</h3>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex justify-between items-center">
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
        <ul className="space-y-4">
          {comingSoonPosts.map((post) => (
            <li key={post.id || post.title} className="p-4 border rounded-lg opacity-70 bg-gray-50 dark:bg-gray-850">
              {/* Optional: Add LottieAnimation here if desired */}
              {/* <LottieAnimation animationData={animationData} className="w-16 h-16 mr-4" /> */}
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{post.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Coming Soon...</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No upcoming posts announced yet.</p>
      )}
    </div>
  );
}
