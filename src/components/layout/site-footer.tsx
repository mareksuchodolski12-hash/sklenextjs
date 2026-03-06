import { siteConfig } from '@/config/site';

import { Container } from './container';

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-sage/20 py-8">
      <Container className="flex flex-col gap-2 text-sm text-brand-charcoal/70 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
        <p>Designed for elevated outdoor living.</p>
      </Container>
    </footer>
  );
}
