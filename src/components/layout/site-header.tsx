import Link from 'next/link';

import { siteConfig } from '@/config/site';
import type { NavigationItem } from '@/types';

import { Container } from './container';

const navItems: NavigationItem[] = [
  { label: 'Shop', href: '#' },
  { label: 'Collections', href: '#' },
  { label: 'Our Story', href: '#' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-sage/20 bg-brand-cream/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-serif text-xl tracking-wide text-brand-moss">
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="text-sm font-medium text-brand-charcoal/80 transition hover:text-brand-moss">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
