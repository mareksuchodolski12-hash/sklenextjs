import 'server-only';

import type { Prisma } from '@prisma/client';

import { prisma } from '@/lib/prisma';

type AdminProductListRecord = Prisma.ProductGetPayload<{
  include: {
    category: {
      select: {
        name: true;
      };
    };
  };
}>;

type AdminProductDetailRecord = Prisma.ProductGetPayload<{
  include: {
    images: {
      orderBy: {
        position: 'asc';
      };
    };
    collections: {
      include: {
        collection: {
          select: {
            id: true;
            title: true;
          };
        };
      };
    };
  };
}>;

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
    const rows = await prisma.product.findMany({
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

    return rows.map((item: AdminProductListRecord) => ({
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
    }));
  } catch {
    return [];
  }
}

export async function getAdminProductById(
  productId: string,
): Promise<AdminProductDetailRecord | null> {
  try {
    return await prisma.product.findUnique({
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
  } catch {
    return null;
  }
}

export async function getAdminTaxonomyOptions() {
  try {
    const [categories, collections] = await Promise.all([
      prisma.category.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      }),
      prisma.collection.findMany({
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
      categories,
      collections,
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
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.count(),
      prisma.collection.count(),
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
