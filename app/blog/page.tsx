import BlogList from './BlogList';
import { getViewsCount } from 'app/db/queries'; // Import getViewsCount

export const metadata = {
  title: 'Blog',
  description: 'DanielKS\'s thoughts on a plethora of subject matter, namely software engineering , personal growth, and more.',
};

// BlogPage is a server component that fetches allViews and passes them to BlogList.
export default async function BlogPage() { // Ensure component is async
  const allViews = await getViewsCount(); // Fetch allViews
  
  return (
    <section className={'animate-fadeIn'}>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        my stories, opinions, projects and untamed thoughts all let loose onto a page
      </h1>
      {/* Pass allViews to BlogList */}
      <BlogList allViews={allViews} /> 
    </section>
  );
}

// Removed the Views async component as ViewCounter is now used directly within BlogList.tsx
// and data fetching specific to blog views (if any, beyond what ViewCounter does)
// would also be encapsulated there or in its related components/API calls, or passed via props.