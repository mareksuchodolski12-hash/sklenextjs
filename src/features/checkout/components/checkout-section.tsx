import type { ReactNode } from 'react';

type CheckoutSectionProps = {
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export function CheckoutSection({ eyebrow, title, children }: CheckoutSectionProps) {
  return (
    <section className="rounded-3xl border border-brand-sage/20 bg-white p-5 shadow-soft sm:p-7">
      <p className="text-xs uppercase tracking-[0.16em] text-brand-sage">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-3xl text-brand-moss">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
