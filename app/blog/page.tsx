import BlogList from './BlogList';

export const metadata = {
  title: 'Blog',
  description: 'DanielKS\'s thoughts on a plethora of subject matter, namely software engineering, personal growth, and more.',
};

export default function BlogPage() {

  return (
    <section className={'animate-fadeIn'}>
      <h1 className="font-medium text-2xl mb-8 tracking-tighter">
        my stories, opinions, projects and untamed thoughts all let loose onto a page
      </h1>

      <BlogList />
    </section>
  );
}