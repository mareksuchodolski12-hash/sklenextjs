import Link from 'next/link';
import type { ReactNode } from 'react';

import { Container } from '@/components/layout/container';
import { requireAdminSession } from '@/lib/admin-auth';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/products/new', label: 'New product' },
  { href: '/admin/taxonomy', label: 'Categories & collections' },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await requireAdminSession();

  return (
    <section className="py-8 sm:py-10">
      <Container className="space-y-6">
        <header className="rounded-2xl border border-brand-sage/20 bg-white p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">Admin</p>
          <h1 className="mt-2 font-serif text-3xl text-brand-moss">Catalog management</h1>
          <p className="mt-2 text-sm text-brand-charcoal/70">
            Signed in as <span className="font-medium">{session.user.email}</span>
          </p>

          <nav className="mt-4 flex flex-wrap gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-brand-sage/30 px-4 py-2 text-sm font-semibold text-brand-moss"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </header>

        {children}
      </Container>
    </section>
  );
}
