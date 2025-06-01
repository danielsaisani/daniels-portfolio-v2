import type { Metadata } from 'next';
import { getBlogPosts, getBlogPost } from '@/app/db/blog'; // Ensure correct path
import BlogPostClientPage from './BlogPostClientPage';

interface PostForMeta {
  slug: string;
  title: string;
  publishedAt: string;
  [key: string]: any;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata | undefined> {
  console.log(`[generateMetadata] Starting for slug: ${params.slug}`);
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://danielsaisani.com';
    console.log(`[generateMetadata] Site URL: ${siteUrl}`);

    console.log('[generateMetadata] Fetching all posts metadata...');
    const allPostsMeta = await getBlogPosts();
    // Using a simpler log for allPostsMeta to avoid overly verbose output unless necessary
    console.log(`[generateMetadata] All posts metadata fetched. Count: ${allPostsMeta?.length || 0}`);


    if (!allPostsMeta || allPostsMeta.length === 0) {
      console.warn('[generateMetadata] No posts metadata found or empty array.');
      return { title: "Blog Post Not Found - No Metadata Available" };
    }

    const metaForPost = allPostsMeta.find(p => p.slug === params.slug);
    // Log metaForPost carefully, it might contain more data than needed for simple log
    if (metaForPost) {
      console.log(`[generateMetadata] Metadata for slug '${params.slug}': blogId: ${metaForPost.blogId}, title: ${metaForPost.title}`);
    } else {
      console.log(`[generateMetadata] Metadata for slug '${params.slug}': Not found`);
    }


    if (!metaForPost || !metaForPost.blogId) {
      console.warn(`[generateMetadata] No matching metadata or blogId found for slug: ${params.slug}`);
      return { title: "Blog Post Not Found - No Matching Metadata" };
    }

    console.log(`[generateMetadata] Fetching post details for blogId: ${metaForPost.blogId}...`);
    const postDataForMeta = await getBlogPost(metaForPost.blogId);
    if (postDataForMeta) {
      console.log(`[generateMetadata] Post details fetched for blogId '${metaForPost.blogId}', title: ${postDataForMeta.title}`);
    } else {
      console.log(`[generateMetadata] Post details for blogId '${metaForPost.blogId}': Not found`);
    }


    if (!postDataForMeta) {
      console.warn(`[generateMetadata] No post data found for blogId: ${metaForPost.blogId}`);
      return { title: "Blog Post Not Found - Details Missing" };
    }

    const finalPostData: PostForMeta = {
      ...postDataForMeta,
      slug: metaForPost.slug
    };
    // Avoid logging the entire finalPostData if it's too large or contains sensitive info not relevant for this log level
    console.log(`[generateMetadata] Final post data for metadata construction: title: ${finalPostData.title}, slug: ${finalPostData.slug}`);

    const metadataResult: Metadata = {
      title: finalPostData.title,
      openGraph: {
        title: finalPostData.title,
        type: 'article',
        publishedTime: finalPostData.publishedAt,
        url: `${siteUrl}/blog/${finalPostData.slug}`,
        // images: [ { url: `${siteUrl}/path/to/image.jpg` } ]
      },
      twitter: { // Added twitter card for completeness, similar to previous state
        card: 'summary_large_image',
        title: finalPostData.title,
      },
    };
    // Avoid logging the full metadataResult if too verbose for most cases
    console.log(`[generateMetadata] Successfully generated metadata for title: ${metadataResult.title}`);
    return metadataResult;

  } catch (error) {
    console.error(`[generateMetadata] CRITICAL ERROR for slug '${params.slug}':`, error);
    return {
      title: "Error Generating Metadata",
      description: "There was an issue generating metadata for this page."
    };
  }
}

// This is the new Server Component default export
export default function BlogPageEntry({ params }: { params: { slug: string } }) {
  // This server component simply passes params to the client component,
  // allowing the client component to handle its own data fetching and rendering.
  return <BlogPostClientPage params={params} />;
}
