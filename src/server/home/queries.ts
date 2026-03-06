import 'server-only';

import { unstable_cache } from 'next/cache';

import type { HomeCategory } from '@/features/home/types/home';

import { getCatalogCategories } from '@/server/catalog/queries';

export const getHomeCategories = unstable_cache(
  async (): Promise<HomeCategory[]> => {
    const categories = await getCatalogCategories();

    return categories.slice(0, 3).map((category) => ({
      title: category.name,
      eyebrow: 'Catalog category',
      description:
        category.description ||
        `Discover ${category.name.toLowerCase()} selected for lasting garden performance.`,
      href: `/plants?category=${category.slug}`,
    }));
  },
  ['home:categories'],
  {
    tags: ['home', 'categories'],
    revalidate: 300,
  },
);
