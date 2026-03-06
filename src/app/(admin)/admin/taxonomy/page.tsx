import { getAdminTaxonomyOptions } from '@/server/admin/catalog-queries';

export default async function AdminTaxonomyPage() {
  const { categories, collections } = await getAdminTaxonomyOptions();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-brand-sage/20 bg-white p-5 shadow-soft">
        <p className="text-xs uppercase tracking-[0.14em] text-brand-sage">Categories</p>
        <h2 className="mt-1 font-serif text-2xl text-brand-moss">Category management shell</h2>
        <p className="mt-2 text-sm text-brand-charcoal/75">
          Next step: add create/edit actions with slug validation and merchandising image handling.
        </p>

        <ul className="mt-4 space-y-2 text-sm">
          {categories.map((category) => (
            <li key={category.id} className="rounded-xl border border-brand-sage/20 px-3 py-2">
              <p className="font-medium text-brand-charcoal">{category.name}</p>
              <p className="text-xs text-brand-charcoal/60">/{category.slug}</p>
            </li>
          ))}
          {categories.length === 0 ? (
            <li className="rounded-xl border border-brand-sage/20 px-3 py-2 text-brand-charcoal/70">
              No categories found.
            </li>
          ) : null}
        </ul>
      </section>

      <section className="rounded-2xl border border-brand-sage/20 bg-white p-5 shadow-soft">
        <p className="text-xs uppercase tracking-[0.14em] text-brand-sage">Collections</p>
        <h2 className="mt-1 font-serif text-2xl text-brand-moss">Collection management shell</h2>
        <p className="mt-2 text-sm text-brand-charcoal/75">
          Next step: add curated sort ordering controls and collection hero content editing.
        </p>

        <ul className="mt-4 space-y-2 text-sm">
          {collections.map((collection) => (
            <li key={collection.id} className="rounded-xl border border-brand-sage/20 px-3 py-2">
              <p className="font-medium text-brand-charcoal">{collection.title}</p>
              <p className="text-xs text-brand-charcoal/60">/{collection.slug}</p>
            </li>
          ))}
          {collections.length === 0 ? (
            <li className="rounded-xl border border-brand-sage/20 px-3 py-2 text-brand-charcoal/70">
              No collections found.
            </li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
