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
  id: number; // Strapi's numeric primary key
  documentId: string; // Strapi's UID field (e.g., for querying by a consistent string ID)
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
    const fetchBlogData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [publishedResponse, draftResponse] = await Promise.all([
          fetch('/api/blogs'), // Fetches published posts (or all if not filtered by API)
          fetch('/api/blogs?status=draft') // Fetches draft posts
        ]);
  
        if (!publishedResponse.ok || !draftResponse.ok) {
          let errorMsg = 'Failed to fetch blog data.';
          if (!publishedResponse.ok) {
              // Try to parse error, default to statusText if parsing fails or no specific error field
              const presErrorBody = await publishedResponse.json().catch(() => null);
              const presErrorDetail = presErrorBody?.error || publishedResponse.statusText;
              errorMsg += ` Published endpoint error: ${publishedResponse.status} ${presErrorDetail}.`;
          }
          if (!draftResponse.ok) {
              const dresErrorBody = await draftResponse.json().catch(() => null);
              const dresErrorDetail = dresErrorBody?.error || draftResponse.statusText;
              errorMsg += ` Draft endpoint error: ${draftResponse.status} ${dresErrorDetail}.`;
          }
          throw new Error(errorMsg);
        }
  
        const publishedResult = await publishedResponse.json();
        const draftResult = await draftResponse.json();
  
        // Assuming the API returns data in result.response.data structure
        // Changed from response?.data to response.data as per prompt
        const fetchedPublishedPosts: ApiPost[] = publishedResult.response.data || []; 
        const fetchedDraftPosts: ApiPost[] = draftResult.response.data || [];
  
        // Filter and set the published posts
        // Ensure publishedAt is valid for PublishedPost type and not in the future.
        const validPublishedPosts = fetchedPublishedPosts.filter(
          p => p.publishedAt && new Date(p.publishedAt) <= new Date()
        );
        setPosts(validPublishedPosts.map(p => ({ ...p, publishedAt: p.publishedAt! })));
        
  
        // Determine "Coming Soon" posts
        // Create a Set of documentIds from validPublishedPosts for efficient lookup.
        // Changed from p.id to p.documentId
        const publishedDocumentIds = new Set(validPublishedPosts.map(p => p.documentId)); 
  
        const actualComingSoonPosts = fetchedDraftPosts.filter(draftPost => {
          // Condition 1: `publishedAt` is falsy (null, undefined, empty string)
          const isPublishedAtFalsy = !draftPost.publishedAt;
          // Condition 2: The post is not already in the list of published IDs.
          // Changed from draftPost.id to draftPost.documentId
          const notInPublished = !publishedDocumentIds.has(draftPost.documentId); 
  
          return isPublishedAtFalsy && notInPublished;
        });
        
        // Ensure publishedAt is explicitly null for UpcomingPost type.
        setComingSoonPosts(actualComingSoonPosts.map(p => ({ ...p, publishedAt: null })));
  
        // Clear any previous error messages on successful fetch
        setError(null);
  
      } catch (err) {
        console.error("Error fetching blog data:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        // Clear posts on error to avoid displaying stale data
        setPosts([]);
        setComingSoonPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBlogData();
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
            <li key={post.id} className="p-4 border rounded-lg hover:bg-gray-50 hover:text-dark dark:hover:bg-gray-800 transition-colors">
              <Link href={`/blog/${post.slug}`} className="block">
                {/* Changed dark mode title color to white */}
                <h3 className="text-xl font-semibold dark:text-white">{post.title}</h3>
                {/* Changed dark mode secondary text color to gray-300 */}
                <div className="text-sm text-gray-500 dark:text-gray-300 mt-1 flex justify-between items-center">
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
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
              key={post.documentId || post.id} // Changed key to use documentId or numeric id
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
