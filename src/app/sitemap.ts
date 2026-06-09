import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const paths = ['', '/privacy', '/terms', '/disclaimer', '/support'];

  return paths.map((path, index) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: index === 0 ? 'monthly' : 'yearly',
    priority: index === 0 ? 1 : 0.3,
  }));
}
