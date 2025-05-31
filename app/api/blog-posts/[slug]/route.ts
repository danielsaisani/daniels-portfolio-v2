import { NextResponse } from 'next/server';
import { getBlogPosts, getBlogPost } from '@/app/db/blog'; // Adjust path if necessary

// Define a simple Post type for what this API route returns
// This should align with what BlogPostClientPage expects
interface Post {
  blogId: string;
  slug: string;
  title: string;
  publishedAt: string;
  blocks: Array<{ body: string }>;
  [key: string]: any; // For other properties from rawPostData
}

export async function GET(
  request: Request, // First argument is Request
  { params }: { params: { slug: string } } // Second argument contains params
) {
  const slug = params.slug;

  if (!slug) {
    return NextResponse.json({ message: 'Slug parameter is missing.' }, { status: 400 });
  }

  try {
    // 1. Fetch all posts metadata to find the blogId
    const allPostsMetaData = await getBlogPosts();
    if (!allPostsMetaData || allPostsMetaData.length === 0) {
      return NextResponse.json({ message: 'No post metadata found.' }, { status: 404 });
    }

    const blogMetaData = allPostsMetaData.find(p => p.slug === slug);

    if (!blogMetaData || !blogMetaData.blogId) {
      return NextResponse.json({ message: `Post with slug '${slug}' not found.` }, { status: 404 });
    }

    // 2. Fetch the specific post using blogId
    const rawPostData = await getBlogPost(blogMetaData.blogId);
    if (!rawPostData) {
      return NextResponse.json({ message: `Data for post with slug '${slug}' could not be loaded.` }, { status: 404 });
    }

    // 3. Construct the final Post object
    const finalPostData: Post = {
      ...rawPostData,
      blogId: blogMetaData.blogId,
      slug: blogMetaData.slug, // Ensure slug from metadata (which matches param) is used
      // Ensure essential fields like title, publishedAt, blocks are part of finalPostData
      // These should primarily come from rawPostData. Add fallbacks if necessary.
      title: rawPostData.title || "Untitled",
      publishedAt: rawPostData.publishedAt || new Date().toISOString(),
      blocks: rawPostData.blocks || [],
    };

    return NextResponse.json(finalPostData);

  } catch (error) {
    console.error(`Error in /api/blog-posts/${slug} GET route:`, error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Failed to fetch post', error: errorMessage }, { status: 500 });
  }
}
