export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://danielsaisani.com';
  return {
    rules: [
      {
        userAgent: '*',
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
