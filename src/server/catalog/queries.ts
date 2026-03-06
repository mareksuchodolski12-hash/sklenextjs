import 'server-only';

import { unstable_cache } from 'next/cache';

import {
  applyCatalogFilters,
  sortCatalogProducts,
  type CatalogSort,
} from '@/domain/catalog/discovery';
import type { Product, ProductCategory } from '@/domain/catalog/models';
import { prisma } from '@/lib/prisma';

import { mapCategoryToViewModel, mapProductToViewModel } from './mappers';

type DbClient = {
  product: {
    findMany(args: unknown): Promise<unknown[]>;
    findUnique(args: unknown): Promise<unknown | null>;
  };
  category: {
    findMany(
      args: unknown,
    ): Promise<Array<{ id: string; slug: string; name: string; description: string | null }>>;
  };
  collection: {
    findUnique(args: unknown): Promise<unknown | null>;
  };
};

const db = prisma as unknown as DbClient;

const productInclude = {
  category: true,
  images: {
    orderBy: {
      position: 'asc' as const,
    },
  },
  tags: {
    include: {
      tag: true,
    },
  },
  attributes: true,
};

async function fetchProducts(): Promise<Product[]> {
  try {
    const products = await db.product.findMany({
      where: {
        isActive: true,
      },
      include: productInclude,
    });

    return products.map((product) =>
      mapProductToViewModel(product as Parameters<typeof mapProductToViewModel>[0]),
    );
  } catch {
    return [];
  }
}

export const getCatalogProducts = unstable_cache(fetchProducts, ['catalog:products'], {
  tags: ['catalog', 'products'],
  revalidate: 300,
});

export const getCatalogCategories = unstable_cache(
  async (): Promise<ProductCategory[]> => {
    try {
      const categories = await db.category.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          slug: true,
          name: true,
          description: true,
        },
      });

      return categories.map(mapCategoryToViewModel);
    } catch {
      return [];
    }
  },
  ['catalog:categories'],
  {
    tags: ['catalog', 'categories'],
    revalidate: 300,
  },
);

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const products = await getCatalogProducts();
  return products.filter((product: Product) => product.featured).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: productInclude,
    });

    if (!product || !(product as { isActive?: boolean }).isActive) {
      return null;
    }

    return mapProductToViewModel(product as Parameters<typeof mapProductToViewModel>[0]);
  } catch {
    return null;
  }
}

export async function getRelatedProducts(slug: string, limit = 3): Promise<Product[]> {
  const source = await getProductBySlug(slug);
  if (!source) {
    return [];
  }

  const products = await getCatalogProducts();

  return products
    .filter((candidate: Product) => candidate.slug !== source.slug)
    .map((candidate: Product) => {
      let score = 0;

      if (candidate.category === source.category) {
        score += 2;
      }

      score += candidate.styles.filter((style) => source.styles.includes(style)).length;
      score += candidate.effects.filter((effect) => source.effects.includes(effect)).length;

      return { candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export async function getCollectionBySlug(slug: string) {
  try {
    return await db.collection.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        subtitle: true,
        description: true,
      },
    });
  } catch {
    return null;
  }
}

export async function getFilteredListingProducts(
  filters: Parameters<typeof applyCatalogFilters>[1],
  sort: CatalogSort,
): Promise<Product[]> {
  const products = await getCatalogProducts();
  const filtered = applyCatalogFilters(products, filters);
  return sortCatalogProducts(filtered, sort);
}
