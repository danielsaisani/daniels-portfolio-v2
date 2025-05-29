// app/api/views/all/route.ts
import { getViewsCount } from '@/app/db/queries'; // Using @ alias for app directory
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allViewsData = await getViewsCount();
    return NextResponse.json({ success: true, views: allViewsData });
  } catch (error) {
    console.error('Error fetching all view counts:', error);
    // It's good practice to avoid sending the raw error to the client in production
    // For this exercise, the generic message is fine.
    let errorMessage = 'Failed to fetch all view counts';
    if (error instanceof Error) {
      // Potentially log error.message to your logging service if more details are needed for debugging
    }
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
