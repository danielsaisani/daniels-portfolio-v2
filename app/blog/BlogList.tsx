'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { Skeleton } from '@/app/components/ui/skeleton';
import ViewCounter from './view-counter';
import { LottieAnimation } from '@/app/components/ui/lottie';
import { BlogCard, ComingSoonCard } from '@/app/components/ui/cards';
interface ApiPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  publishedAt: string | null;
}

interface PublishedPost extends ApiPost {
  publishedAt: string;
}

interface UpcomingPost extends ApiPost {
}

interface ViewCount {
  slug: string;
  count: number;
}

export default function BlogList() {
  const [posts, setPosts] = useState<PublishedPost[]>([]);
  const [comingSoonPosts, setComingSoonPosts] = useState<UpcomingPost[]>([]);
  const [allViewsData, setAllViewsData] = useState<ViewCount[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [publishedResponse, draftResponse] = await Promise.all([
          fetch('/api/blogs'),
          fetch('/api/blogs?status=draft')
        ]);

        if (!publishedResponse.ok || !draftResponse.ok) {
          let errorMsg = 'Failed to fetch blog data.';
          if (!publishedResponse.ok) {
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

        const fetchedPublishedPosts: ApiPost[] = publishedResult.response.data || [];
        const fetchedDraftPosts: ApiPost[] = draftResult.response.data || [];

        const validPublishedPosts = fetchedPublishedPosts.filter(
          p => p.publishedAt && new Date(p.publishedAt) <= new Date()
        );
        setPosts(validPublishedPosts.map(p => ({ ...p, publishedAt: p.publishedAt! })));

        const publishedDocumentIds = new Set(validPublishedPosts.map(p => p.documentId));

        const actualComingSoonPosts = fetchedDraftPosts.filter(draftPost => {
          const isPublishedAtFalsy = !draftPost.publishedAt;
          const notInPublished = !publishedDocumentIds.has(draftPost.documentId);

          return isPublishedAtFalsy && notInPublished;
        });

        setComingSoonPosts(actualComingSoonPosts.map(p => ({ ...p, publishedAt: null })));

        try {
          const viewsResponse = await fetch('/api/views/all');
          if (!viewsResponse.ok) {
            console.error('Failed to fetch all views:', viewsResponse.statusText);
          } else {
            const viewsResult = await viewsResponse.json();
            if (viewsResult.success) {
              setAllViewsData(viewsResult.views);
            } else {
              console.error('Error in views API response:', viewsResult.error);
            }
          }
        } catch (viewsError) {
          console.error('Error fetching views data:', viewsError);
        }

        setError(null);

      } catch (err) {
        console.error("Error fetching blog data:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
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
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-2xl shadow-lg border-2 border-dark p-5 bg-purple/20 flex flex-col justify-between min-h-[180px] min-w-[180px]"
            >
              <div>
                <Skeleton className="h-7 w-3/4 mb-4 rounded-lg bg-gray-300 dark:bg-gray-700" />
              </div>
              <div className="flex items-center justify-between mt-2">
                <Skeleton className="h-4 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-1/4 rounded-lg bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.slice(0, 9).map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              date={new Date(post.publishedAt).toLocaleDateString()}
              href={`/blog/${post.slug}`}
            >
              {post.slug && (
                <Suspense fallback={<div className="h-5 w-10 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md"></div>}>
                  <ViewCounter slug={post.slug} allViews={allViewsData} />
                </Suspense>
              )}
            </BlogCard>
          ))
        ) : (
          <div className="col-span-3 text-center py-10 text-lg text-gray-400">No published posts yet. Check back soon!</div>
        )}
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-center">Coming Soon</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {comingSoonPosts.length > 0 ? (
          comingSoonPosts.slice(0, 9).map((post) => (
            <ComingSoonCard
              key={post.documentId || post.id}
              title={post.title}
            >
              <Suspense fallback={<div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>}>
                <LottieAnimation width={30} height={30} type={'writing'} />
              </Suspense>
            </ComingSoonCard>
          ))
        ) : (
          <div className="col-span-3 text-center py-10 text-lg text-gray-400">No upcoming posts announced yet.</div>
        )}
      </div>
    </div>
  );
}
