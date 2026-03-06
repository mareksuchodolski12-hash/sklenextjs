import type { MetadataRoute } from 'next';

import { getSiteUrl } from '@/lib/seo';
import { getCatalogProducts } from '@/server/catalog/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const products = await getCatalogProducts();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: new URL('/', baseUrl).toString(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: new URL('/plants', baseUrl).toString(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: new URL('/discovery', baseUrl).toString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: new URL(`/plants/${product.slug}`, baseUrl).toString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}
