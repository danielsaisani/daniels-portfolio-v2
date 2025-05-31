import type { Metadata } from 'next';
import { Suspense, cache } from 'react'; // Ensure Suspense is imported
import { notFound } from 'next/navigation';
import { CustomMDX } from '@/app/components/ui/mdx';
import { getViewsCount } from 'app/db/queries';
import { getBlogPosts, getBlogPost } from 'app/db/blog';
import ViewCounter from '../view-counter';
import { increment } from 'app/db/actions';
import { unstable_noStore as noStore } from 'next/cache';
import BlogPostSkeleton from './skeleton'; // Import the skeleton
import { Skeleton } from '@/app/components/ui/skeleton'; // Import Skeleton for inner fallbacks

export async function generateMetadata({
  params,
}): Promise<Metadata | undefined> {
  // Logic for metadata generation remains the same
  // It's important that this uses params.slug directly as before,
  // and not rely on the find operation which is now in PostContent
  const posts = await getBlogPosts();
  const blog = posts.find(post => post.slug === params.slug);

  if (!blog) {
    return;
  }
  const post = await getBlogPost(blog.blogId);

  if (!post) {
    return;
  }

  let {
    title,
    publishedAt: publishedTime,
    // summary: description, // Assuming these are handled or not needed for now
    // image,
  } = { ...post };

  // let ogImage = image
  //   ? `https://danielsaisani.com${image}`
  //   : `https://danielsaisani.com/og?title=${title}`;

  return {
    title,
    // description,
    openGraph: {
      title,
      // description,
      type: 'article',
      publishedTime,
      url: `https://danielsaisani.com/blog/${post.slug}`,
      // images: [
      //   {
      //     url: ogImage,
      //   },
      // ],
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
  // ... (rest of formatDate function remains unchanged)
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
    const weeksAgo = Math.floor(daysAgo / 7)
    return `${fullDate} (${weeksAgo}w ago)`;
  } else if (daysAgo < 365) {
    const monthsAgo = Math.floor(daysAgo / 30)
    return `${fullDate} (${monthsAgo}mo ago)`;
  } else {
    const yearsAgo = Math.floor(daysAgo / 365)
    return `${fullDate} (${yearsAgo}y ago)`;
  }
}

let incrementViews = cache(increment);

async function Views({ slug }: { slug: string }) {
  let views = await getViewsCount();
  incrementViews(slug);
  return <ViewCounter allViews={views} slug={slug} />;
}

// Define the new async component for the actual content
async function PostContent({ params }) {
  const posts = await getBlogPosts();
  const blog = posts.find(post => post.slug === params.slug);

  if (!blog) {
    notFound();
  }
  // Ensure blog is not undefined before accessing blogId
  const post = await getBlogPost(blog.blogId);

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
            description: post.title, // Assuming title is okay for description
            image: post.title // Assuming title is okay for image, adjust if needed
              ? `https://www.danielsaisani.com/opengraph-image.png` // Placeholder, original logic was post.title which is not an image URL
              : `https://www.danielsaisani.com/og?title=${post.title}`,
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
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <Suspense fallback={<Skeleton className="h-5 w-1/4 rounded-lg" />}> {/* Smaller skeleton for date */}
          <p className="text-sm">
            {formatDate(post.publishedAt)}
          </p>
        </Suspense>
        <Suspense fallback={<Skeleton className="h-5 w-1/4 rounded-lg" />}> {/* Smaller skeleton for views */}
          <Views slug={post.slug} />
        </Suspense>
      </div>
      <article className="pb-20">
        <CustomMDX source={post.blocks[0].body} />
      </article>
    </section>
  );
}

// Modified default export Blog function
export default function Blog({ params }) {
  return (
    <Suspense fallback={<BlogPostSkeleton />}>
      <PostContent params={params} />
    </Suspense>
  );
}
