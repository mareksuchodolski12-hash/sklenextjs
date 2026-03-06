import 'server-only';

import { prisma } from '@/lib/prisma';

type DbClient = {
  product: {
    findMany(args: unknown): Promise<unknown[]>;
    findUnique(args: unknown): Promise<unknown | null>;
    count(args?: unknown): Promise<number>;
  };
  category: {
    findMany(args: unknown): Promise<unknown[]>;
    count(args?: unknown): Promise<number>;
  };
  collection: {
    findMany(args: unknown): Promise<unknown[]>;
    count(args?: unknown): Promise<number>;
  };
};

const db = prisma as unknown as DbClient;

type AdminProductListItem = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: string;
  isActive: boolean;
  stockStatus: string;
  quantityOnHand: number;
  categoryName: string;
  updatedAt: Date;
};

export async function getAdminProductList(): Promise<AdminProductListItem[]> {
  try {
    const rows = await db.product.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      take: 100,
    });

    return rows.map((row) => {
      const item = row as {
        id: string;
        name: string;
        slug: string;
        sku: string;
        price: { toString(): string };
        isActive: boolean;
        stockStatus: string;
        quantityOnHand: number;
        updatedAt: Date;
        category?: { name?: string | null };
      };

      return {
        id: item.id,
        name: item.name,
        slug: item.slug,
        sku: item.sku,
        price: item.price.toString(),
        isActive: item.isActive,
        stockStatus: item.stockStatus,
        quantityOnHand: item.quantityOnHand,
        categoryName: item.category?.name ?? 'Uncategorized',
        updatedAt: item.updatedAt,
      };
    });
  } catch {
    return [];
  }
}

export async function getAdminProductById(productId: string) {
  try {
    const row = await db.product.findUnique({
      where: { id: productId },
      include: {
        images: {
          orderBy: { position: 'asc' },
        },
        collections: {
          include: {
            collection: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    return row as {
      id: string;
      name: string;
      slug: string;
      shortDescription: string;
      longDescription: string;
      sku: string;
      price: { toString(): string };
      compareAtPrice: { toString(): string } | null;
      categoryId: string;
      isActive: boolean;
      featured: boolean;
      quantityOnHand: number;
      trackInventory: boolean;
      images: Array<{ id: string; url: string; alt: string; position: number; isPrimary: boolean }>;
      collections: Array<{ collection: { id: string; title: string } }>;
    } | null;
  } catch {
    return null;
  }
}

export async function getAdminTaxonomyOptions() {
  try {
    const [categories, collections] = await Promise.all([
      db.category.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),
      db.collection.findMany({
        orderBy: { title: 'asc' },
        select: {
          id: true,
          title: true,
          slug: true,
          isFeatured: true,
        },
      }),
    ]);

    return {
      categories: categories as Array<{ id: string; name: string; slug: string }>,
      collections: collections as Array<{
        id: string;
        title: string;
        slug: string;
        isFeatured: boolean;
      }>,
    };
  } catch {
    return {
      categories: [],
      collections: [],
    };
  }
}

export async function getAdminDashboardSummary() {
  try {
    const [productCount, activeProductCount, categoryCount, collectionCount] = await Promise.all([
      db.product.count(),
      db.product.count({ where: { isActive: true } }),
      db.category.count(),
      db.collection.count(),
    ]);

    return {
      productCount,
      activeProductCount,
      categoryCount,
      collectionCount,
    };
  } catch {
    return {
      productCount: 0,
      activeProductCount: 0,
      categoryCount: 0,
      collectionCount: 0,
    };
  }
}
