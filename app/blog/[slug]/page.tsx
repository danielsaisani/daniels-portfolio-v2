import type { Metadata } from 'next';
import { Suspense, cache } from 'react';
import { notFound } from 'next/navigation';
import { CustomMDX } from '@/app/components/ui/mdx';
import { getViewsCount } from 'app/db/queries';
// getBlogPosts is needed to find slug -> blogId mapping
import { getBlogPosts, getBlogPost } from 'app/db/blog';
import ViewCounter from '../view-counter';
import { increment } from 'app/db/actions';
import { unstable_noStore as noStore } from 'next/cache';
import BlogPostSkeleton from './skeleton';
import { Skeleton } from '@/app/components/ui/skeleton';

// Define Post type (can be expanded based on actual data structure)
interface Post {
  slug: string;
  title: string;
  publishedAt: string;
  blocks: Array<{ body: string }>; // Example structure
  blogId: string; // Ensure blogId is part of the Post type if used
  // Add other necessary post fields
}

export async function generateMetadata({
  params,
}: { params: { slug: string } }): Promise<Metadata | undefined> {
  // Adapted fetching: first get all posts to find the blogId by slug
  const allPosts = await getBlogPosts();
  const blogMetaData = allPosts.find(p => p.slug === params.slug);

  if (!blogMetaData || !blogMetaData.blogId) {
    // If no post found with that slug, or blogId is missing
    return;
  }

  const post = await getBlogPost(blogMetaData.blogId);

  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
  } = post;

  return {
    title,
    openGraph: {
      title,
      type: 'article',
      publishedTime,
      url: `https://danielsaisani.com/blog/${post.slug}`,
      // images: [ ... ]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      // description,
      // images: [ogImage],
    },
  };
}

function formatDate(date: string) {
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

let incrementViews = cache(increment);

async function Views({ slug }: { slug: string }) {
  let views = await getViewsCount();
  incrementViews(slug);
  return <ViewCounter allViews={views} slug={slug} />;
}

interface PostContentProps {
  post: Post; // Use the defined Post interface
}

// Modified PostContent: Receives post as a prop
async function PostContent({ post }: PostContentProps) {
  return (
    <>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <Suspense fallback={<Skeleton className="h-5 w-1/4 rounded-lg" />}>
          <p className="text-sm">
            {formatDate(post.publishedAt)}
          </p>
        </Suspense>
        <Suspense fallback={<Skeleton className="h-5 w-1/4 rounded-lg" />}>
          <Views slug={post.slug} />
        </Suspense>
      </div>
      <article className="pb-20">
        <CustomMDX source={post.blocks[0].body} />
      </article>
    </>
  );
}

interface PostHeaderParams {
  params: { slug: string };
}

// New PostHeader component
async function PostHeader({ params }: PostHeaderParams) {
  // Adapted fetching: first get all posts to find the blogId by slug
  const allPosts = await getBlogPosts();
  const blogMetaData = allPosts.find(p => p.slug === params.slug);

  if (!blogMetaData || !blogMetaData.blogId) {
    notFound();
  }

  const post = await getBlogPost(blogMetaData.blogId) as Post; // Cast to Post

  if (!post) {
    notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.publishedAt,
            dateModified: post.publishedAt,
            description: post.title,
            image: `https://danielsaisani.com/og?title=${encodeURIComponent(post.title)}`,
            url: `https://danielsaisani.com/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Daniel Saisani',
            },
          }),
        }}
      />
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {post.title}
      </h1>
      <PostContent post={post} />
    </section>
  );
}

// Main Blog component
export default function Blog({ params }: PostHeaderParams) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <PostHeader params={params} />
    </Suspense>
  );
}
