import { NextResponse } from 'next/server';
import { getBlogPosts } from '@/app/db/blog'; // Adjust path if necessary

export async function GET() {
  try {
    const posts = await getBlogPosts();
    if (!posts || posts.length === 0) { // Adjusted to check for empty array as well
      // This condition might depend on what getBlogPosts returns on error/no data
      return NextResponse.json({ message: 'No posts found or error fetching posts.' }, { status: 404 });
    }
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in /api/blog-posts GET route:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Failed to fetch posts', error: errorMessage }, { status: 500 });
  }
}
