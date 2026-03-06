import Link from 'next/link';

import { getAdminProductList } from '@/server/admin/catalog-queries';

export default async function AdminProductsPage() {
  const products = await getAdminProductList();

  return (
    <section className="space-y-4 rounded-2xl border border-brand-sage/20 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-brand-sage">Product list</p>
          <h2 className="font-serif text-3xl text-brand-moss">Manage catalog products</h2>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-brand-moss px-4 py-2 text-sm font-semibold text-brand-cream">
          Create product
        </Link>
      </div>

      <div className="overflow-auto rounded-xl border border-brand-sage/20">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-brand-cream/70 text-xs uppercase tracking-[0.08em] text-brand-charcoal/70">
            <tr>
              <th className="px-3 py-2">Product</th>
              <th className="px-3 py-2">SKU</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-brand-sage/15">
                <td className="px-3 py-3">
                  <p className="font-medium text-brand-charcoal">{product.name}</p>
                  <p className="text-xs text-brand-charcoal/60">/{product.slug}</p>
                </td>
                <td className="px-3 py-3 text-brand-charcoal/80">{product.sku}</td>
                <td className="px-3 py-3 text-brand-charcoal/80">{product.categoryName}</td>
                <td className="px-3 py-3 text-brand-charcoal/80">£{product.price}</td>
                <td className="px-3 py-3 text-brand-charcoal/80">
                  {product.quantityOnHand} ({product.stockStatus})
                </td>
                <td className="px-3 py-3">
                  <span className="rounded-full border border-brand-sage/30 px-2 py-1 text-xs text-brand-moss">
                    {product.isActive ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <Link href={`/admin/products/${product.id}`} className="text-sm font-semibold text-brand-moss underline-offset-4 hover:underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-brand-charcoal/70" colSpan={7}>
                  No products found. Seed data or create your first product foundation.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
