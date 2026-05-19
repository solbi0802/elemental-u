import type { MetadataRoute } from 'next';

/* Tell crawlers to index the marketing surface but stay off the
   user-specific card pages and the API routes. The card URLs carry a
   session_token that's meant for sharing via OG previews, not for
   appearing in Google results — both for noise reasons (each user
   creates a unique URL) and to avoid leaking personal data into the
   public web. */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/card/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
