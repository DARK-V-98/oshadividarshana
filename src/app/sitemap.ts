import { MetadataRoute } from 'next';
import { moduleCategories } from '@/lib/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://www.oshadividarshana.online';

  // Static routes
  const routes = [
    '', 
    '/order',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
  }));

  // Dynamic course routes
  const courseRoutes = moduleCategories.map((category) => ({
    url: `${siteUrl}${category.href}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...courseRoutes];
}
