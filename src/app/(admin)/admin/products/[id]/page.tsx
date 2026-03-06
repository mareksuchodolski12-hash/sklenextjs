import { notFound } from 'next/navigation';

import { ProductEditorForm } from '@/features/admin/components/product-editor-form';
import type { ProductEditorInitialData } from '@/features/admin/types';
import { getAdminProductById, getAdminTaxonomyOptions } from '@/server/admin/catalog-queries';

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, taxonomy] = await Promise.all([getAdminProductById(id), getAdminTaxonomyOptions()]);

  if (!product) {
    notFound();
  }

  const initialData: ProductEditorInitialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    longDescription: product.longDescription,
    sku: product.sku,
    price: product.price.toString(),
    compareAtPrice: product.compareAtPrice?.toString() ?? '',
    categoryId: product.categoryId,
    isActive: product.isActive,
    featured: product.featured,
    quantityOnHand: product.quantityOnHand,
    trackInventory: product.trackInventory,
    collectionIds: product.collections.map((entry) => entry.collection.id),
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      position: image.position,
      isPrimary: image.isPrimary,
    })),
  };

  return (
    <ProductEditorForm
      mode="edit"
      initialData={initialData}
      categories={taxonomy.categories.map((entry) => ({ id: entry.id, label: entry.name }))}
      collections={taxonomy.collections.map((entry) => ({ id: entry.id, label: entry.title }))}
    />
  );
}
