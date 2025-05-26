// Removed Link, Suspense, ViewCounter, getViewsCount, getBlogPosts, getUnpublishedBlogPosts, LottieAnimation imports
// as they are no longer directly used in this file. BlogList handles its own needs.
import BlogList from './BlogList';

export const metadata = {
  title: 'Blog',
  description: 'DanielKS\'s thoughts on a plethora of subject matter, namely software engineering , personal growth, and more.',
};

// BlogPage is now a simple server component that renders BlogList (a client component).
export default function BlogPage() {
  // Data fetching and rendering logic has been moved to BlogList.tsx
  return (
    <section className={'animate-fadeIn'}>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        my stories, opinions, projects and untamed thoughts all let loose onto a page
      </h1>
      <BlogList />
    </section>
  );
}

// Removed the Views async component as ViewCounter is now used directly within BlogList.tsx
// and data fetching specific to blog views (if any, beyond what ViewCounter does)
// would also be encapsulated there or in its related components/API calls.