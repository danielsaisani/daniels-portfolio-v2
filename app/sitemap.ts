import { getBlogPosts } from 'app/db/blog';

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://danielsaisani.com';

  // let blogs = (await getBlogPosts()).map((post) => ({
  //   url: `${siteUrl}/blog/${post.slug}`,
  //   lastModified: post.publishedAt,
  // }));

  // '/blog',
  let routes = ['', '/guestbook', '/uses', '/work'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));
  // ...blogs
  return [...routes ];
}
