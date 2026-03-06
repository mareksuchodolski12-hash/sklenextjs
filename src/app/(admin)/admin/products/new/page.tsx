import { ProductEditorForm } from '@/features/admin/components/product-editor-form';
import type { ProductEditorInitialData } from '@/features/admin/types';
import { getAdminTaxonomyOptions } from '@/server/admin/catalog-queries';

const newProductDefaults: ProductEditorInitialData = {
  name: '',
  slug: '',
  shortDescription: '',
  longDescription: '',
  sku: '',
  price: '',
  compareAtPrice: '',
  categoryId: '',
  isActive: true,
  featured: false,
  quantityOnHand: 0,
  trackInventory: true,
  collectionIds: [],
  images: [
    {
      id: 'image-1',
      url: '',
      alt: '',
      position: 0,
      isPrimary: true,
    },
  ],
};

export default async function AdminProductCreatePage() {
  const taxonomy = await getAdminTaxonomyOptions();

  return (
    <ProductEditorForm
      mode="create"
      initialData={newProductDefaults}
      categories={taxonomy.categories.map((entry) => ({ id: entry.id, label: entry.name }))}
      collections={taxonomy.collections.map((entry) => ({ id: entry.id, label: entry.title }))}
    />
  );
}
