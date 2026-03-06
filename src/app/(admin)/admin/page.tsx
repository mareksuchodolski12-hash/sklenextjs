import Link from 'next/link';

import { getAdminDashboardSummary } from '@/server/admin/catalog-queries';

const statItems = [
  { key: 'productCount', label: 'Total products' },
  { key: 'activeProductCount', label: 'Active products' },
  { key: 'categoryCount', label: 'Categories' },
  { key: 'collectionCount', label: 'Collections' },
] as const;

export default async function AdminDashboardPage() {
  const summary = await getAdminDashboardSummary();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((item) => (
          <article key={item.key} className="rounded-2xl border border-brand-sage/20 bg-white p-4 shadow-soft">
            <p className="text-xs uppercase tracking-[0.12em] text-brand-sage">{item.label}</p>
            <p className="mt-2 font-serif text-3xl text-brand-moss">{summary[item.key]}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-brand-sage/20 bg-white p-5 shadow-soft">
        <h2 className="font-serif text-2xl text-brand-moss">Catalog admin foundation</h2>
        <p className="mt-2 text-sm text-brand-charcoal/75">
          Use the products area to create/edit catalog entries. Taxonomy shell is available for
          category and collection operations.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/products" className="rounded-full bg-brand-moss px-4 py-2 text-sm font-semibold text-brand-cream">
            Manage products
          </Link>
          <Link href="/admin/taxonomy" className="rounded-full border border-brand-sage/30 px-4 py-2 text-sm font-semibold text-brand-moss">
            Open taxonomy shell
          </Link>
        </div>
      </section>
    </div>
  );
}
