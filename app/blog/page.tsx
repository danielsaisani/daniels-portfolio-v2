import Link from 'next/link';
import { Suspense } from 'react';
import ViewCounter from './view-counter';
import { getViewsCount } from 'app/db/queries';
import { getBlogPosts, getUnpublishedBlogPosts } from 'app/db/blog';
import { LottieAnimation } from '@/app/components/ui/lottie';

export const metadata = {
  title: 'Blog',
  description: 'DanielKS\'s thoughts on a plethora of subject matter, namely software engineering , personal growth, and more.',
};

export default async function BlogPage() {

  const allBlogs = await getBlogPosts();
  const allBlogsComingSoon = await getUnpublishedBlogPosts();

  return (
    <section className={'animate-fadeIn'}>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        my stories, opinions, projects and untamed thoughts all let loose onto a page
      </h1>
      {allBlogs
        .sort((a, b) => {
          if (
            new Date(a.publishedAt) > new Date(b.publishedAt)
          ) {
            return -1;
          }
          return 1;
        })
        .map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col space-y-1 mb-4"
            href={`/blog/${post.slug}`}
          >
            <div className="w-full flex flex-col hover:bg-gray-100 hover:translate-x-1 hover:bg-opacity-10 duration-200 rounded-md p-4">
              <p className="dark:text-neutral-100 tracking-tight">
                {post.title}
              </p>
              <Suspense fallback={<p className="h-6" />}>
                <Views slug={post.slug} />
              </Suspense>
            </div>
          </Link>
        ))}
      {allBlogsComingSoon
        .map((post) => (
          <Link
            className="flex flex-col space-y-1 mb-4"
            href={`/blog`}
          >
            <div className="w-full flex flex-col hover:bg-gray-100 hover:translate-x-1 hover:bg-opacity-10 duration-200 rounded-md p-4">
              <p className="dark:text-neutral-100 tracking-tight">
                {post.title}
              </p>
              <Suspense fallback={<p className="h-6" />}>
                <LottieAnimation width={30} height={30} type={'writing'} />
              </Suspense>
            </div>
          </Link>
        ))}
    </section >
  );
}

async function Views({ slug }: { slug: string }) {
  let views = await getViewsCount();

  return <ViewCounter allViews={views} slug={slug} />;
}