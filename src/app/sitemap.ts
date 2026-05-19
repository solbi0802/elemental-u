import type { MetadataRoute } from 'next';

/* Only the home page is in the sitemap — /card/* URLs are user-specific
   shareables, not pages that should appear in search results. */
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
  ];
}
