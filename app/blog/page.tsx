import BlogList from './BlogList';
// Removed import { getViewsCount } from 'app/db/queries';

export const metadata = {
  title: 'Blog',
  description: 'DanielKS\'s thoughts on a plethora of subject matter, namely software engineering , personal growth, and more.',
};

// BlogPage is now a simple server component that renders BlogList.
// Made non-async as getViewsCount is removed.
export default function BlogPage() { 
  // Removed: const allViews = await getViewsCount();
  
  return (
    <section className={'animate-fadeIn'}>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        my stories, opinions, projects and untamed thoughts all let loose onto a page
      </h1>
      {/* Removed allViews prop */}
      <BlogList /> 
    </section>
  );
}

// Removed the Views async component as ViewCounter is now used directly within BlogList.tsx
// and data fetching specific to blog views (if any, beyond what ViewCounter does)
// would also be encapsulated there or in its related components/API calls, or passed via props.