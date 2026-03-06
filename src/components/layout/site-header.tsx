import Link from 'next/link';

import { siteConfig } from '@/config/site';

import { Container } from './container';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-sage/20 bg-brand-cream/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-8">
        <Link href="/" className="font-serif text-xl tracking-wide text-brand-moss">
          {siteConfig.branding.name}
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {siteConfig.navigation.main.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-medium text-brand-charcoal/80 transition hover:text-brand-moss">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
