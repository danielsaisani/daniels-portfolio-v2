import { NextResponse } from 'next/server';
import { getBlogPosts, getBlogPost } from '@/app/db/blog'; // Adjust path if necessary
import { serialize } from 'next-mdx-remote/serialize';

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

    // 3. Serialize MDX and construct the final Post object
    let mdxSource = null;
    const rawMdx = rawPostData.blocks && rawPostData.blocks[0] ? rawPostData.blocks[0].body : '';
    if (rawMdx) {
      try {
        mdxSource = await serialize(rawMdx, {
          // We can add mdxOptions for remark/rehype plugins here if needed later
          // For now, parseFrontmatter defaults to false, which is fine if frontmatter is handled separately or not used in body
        });
      } catch (serializeError) {
        console.error(`Error serializing MDX for slug '${slug}':`, serializeError);
        // Decide how to handle serialization errors.
        // For now, we'll let mdxSource remain null and the client can handle it.
      }
    }

    const finalPostData: Post = {
      ...rawPostData,
      blogId: blogMetaData.blogId,
      slug: blogMetaData.slug, // Ensure slug from metadata (which matches param) is used
      title: rawPostData.title || "Untitled",
      publishedAt: rawPostData.publishedAt || new Date().toISOString(),
      // blocks: rawPostData.blocks || [], // Consider if this is still needed by client
      mdxSource: mdxSource, // Add the serialized MDX source
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
