type ProductInfoListProps = {
  title: string;
  intro?: string;
  items: string[];
};

export function ProductInfoList({ title, intro, items }: ProductInfoListProps) {
  return (
    <section className="rounded-3xl border border-brand-sage/20 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="font-serif text-3xl text-brand-moss">{title}</h2>
      {intro ? (
        <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/80">{intro}</p>
      ) : null}
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-2xl border border-brand-sage/15 bg-brand-cream/50 px-4 py-3 text-sm text-brand-charcoal/85"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
