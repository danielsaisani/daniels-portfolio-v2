import { getBlogPosts } from 'app/db/blog';

export default async function sitemap() {
  let blogs = (await getBlogPosts()).map((post) => ({
    url: `https://danielsaisani.com/blog/${post.slug}`,
    lastModified: post.publishedAt,
  }));

  let routes = ['', '/blog', '/guestbook', '/uses', '/work'].map((route) => ({
    url: `https://danielsaisani.com${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}
