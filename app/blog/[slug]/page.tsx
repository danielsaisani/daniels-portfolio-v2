import type { Metadata } from 'next';
import { Suspense, cache } from 'react';
import { notFound } from 'next/navigation';
import { CustomMDX } from '@/app/components/ui/mdx';
import { getViewsCount } from 'app/db/queries';
import { getBlogPosts, getBlogPost } from 'app/db/blog';
import ViewCounter from '../view-counter';
import { increment } from 'app/db/actions';
import { unstable_noStore as noStore } from 'next/cache';
import BlogPostSkeleton from './skeleton';
import { Skeleton } from '@/app/components/ui/skeleton';

// Updated Post interface
interface Post {
  blogId: string;
  slug: string;
  title: string;
  publishedAt: string;
  blocks: Array<{ body: string }>;
  // Add any other fields that are expected to be part of rawPostData
  // For example, if 'description' or other fields are returned by getBlogPost
  [key: string]: any; // Allows other properties from rawPostData
}

export async function generateMetadata({
  params,
}: { params: { slug: string } }): Promise<Metadata | undefined> {
  const allPostsMeta = await getBlogPosts();
  // Ensure allPostsMeta is not null or undefined before calling find
  const metaForPost = allPostsMeta?.find(p => p.slug === params.slug);

  if (!metaForPost || !metaForPost.blogId) {
    return { title: "Blog Post Not Found" };
  }

  const postDataForMeta = await getBlogPost(metaForPost.blogId);

  if (!postDataForMeta) {
    return { title: "Blog Post Data Not Found" };
  }

  // Construct an object that safely provides the needed properties
  const finalPostData = {
    ...postDataForMeta,
    slug: metaForPost.slug, // Ensure slug from metadata is used
    // title and publishedAt should come from postDataForMeta
  };

  return {
    title: finalPostData.title,
    openGraph: {
      title: finalPostData.title,
      type: 'article',
      publishedTime: finalPostData.publishedAt,
      url: `https://danielsaisani.com/blog/${finalPostData.slug}`,
      // images: [ ... ]
    },
    twitter: {
      card: 'summary_large_image',
      title: finalPostData.title,
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
  post: Post;
}

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
        {/* Ensure post.blocks exists and has at least one element */}
        <CustomMDX source={post.blocks && post.blocks.length > 0 ? post.blocks[0].body : ''} />
      </article>
    </>
  );
}

interface PostHeaderParams {
  params: { slug: string };
}

async function PostHeader({ params }: PostHeaderParams) {
  const allPostsMetaData = await getBlogPosts();
  // Ensure allPostsMetaData is not null or undefined before calling find
  const blogMetaData = allPostsMetaData?.find(p => p.slug === params.slug);

  if (!blogMetaData || !blogMetaData.blogId) {
    notFound();
  }

  const rawPostData = await getBlogPost(blogMetaData.blogId);

  if (!rawPostData) {
    notFound();
  }

  // Construct the post object correctly
  const post: Post = {
    ...rawPostData, // Spread raw data from getBlogPost
    blogId: blogMetaData.blogId, // Ensure blogId from metadata is included
    slug: blogMetaData.slug,     // Ensure slug from metadata is included
    // title, publishedAt, blocks should come from rawPostData if available
    // If not, ensure they are part of blogMetaData and explicitly assigned if needed
    title: rawPostData.title || blogMetaData.title, // Prioritize rawPostData, fallback to metadata
    publishedAt: rawPostData.publishedAt, // Assuming publishedAt is in rawPostData
    blocks: rawPostData.blocks || [], // Assuming blocks are in rawPostData
  };

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

export default function Blog({ params }: PostHeaderParams) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <PostHeader params={params} />
    </Suspense>
  );
}
