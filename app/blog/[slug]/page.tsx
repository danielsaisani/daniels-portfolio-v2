import type { Metadata } from 'next';
// Keep only imports needed by generateMetadata and the new default export
import { getBlogPosts, getBlogPost } from '@/app/db/blog';
import BlogPostClientPage from './BlogPostClientPage'; // Import the new client component

// Interface for data used in generateMetadata
// This can be simpler than the full Post interface if fewer fields are needed for metadata
interface PostForMeta {
  slug: string;
  title: string;
  publishedAt: string;
  // Add any other fields from getBlogPost that are used in generateMetadata
  [key: string]: any;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata | undefined> {
  const allPostsMeta = await getBlogPosts();
  const metaForPost = allPostsMeta?.find(p => p.slug === params.slug);

  if (!metaForPost || !metaForPost.blogId) {
    return { title: "Blog Post Not Found" };
  }

  // Fetch the full post data needed for metadata
  const postDataForMeta = await getBlogPost(metaForPost.blogId);

  if (!postDataForMeta) {
    // If the specific post data can't be fetched, return a generic title
    return { title: "Blog Post Details Not Available" };
  }

  // Construct an object that safely provides the needed properties for metadata
  // Ensure that 'slug' from metaForPost (which matches params.slug) is used for the URL
  const finalPostData: PostForMeta = {
    ...postDataForMeta,
    slug: metaForPost.slug
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://danielsaisani.com';

  return {
    title: finalPostData.title,
    openGraph: {
      title: finalPostData.title,
      type: 'article',
      publishedTime: finalPostData.publishedAt,
      url: `${siteUrl}/blog/${finalPostData.slug}`,
      // Consider adding description and images if available in finalPostData
      // description: finalPostData.summary,
      // images: finalPostData.image ? [{ url: `${siteUrl}${finalPostData.image}` }] : [], // Assuming image path starts with /
    },
    twitter: {
      card: 'summary_large_image',
      title: finalPostData.title,
      // description: finalPostData.summary,
      // images: finalPostData.image ? [`${siteUrl}${finalPostData.image}`] : [], // Assuming image path starts with /
    },
    // description: finalPostData.summary, // Add top-level description if available
  };
}

// This is the new Server Component default export
export default function BlogPageEntry({ params }: { params: { slug: string } }) {
  // This server component simply passes params to the client component,
  // allowing the client component to handle its own data fetching and rendering.
  return <BlogPostClientPage params={params} />;
}
