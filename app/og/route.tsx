import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const postTitle = searchParams.get('title');
  const font = fetch(
    new URL('../../public/fonts/kaisei-tokumin-bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());
  const fontData = await font;

  return null
}
