import Link from 'next/link';

import { siteConfig } from '@/config/site';

import { Container } from './container';

export function SiteFooter() {
  const footerGroups = siteConfig.navigation.footer;

  return (
    <footer className="border-t border-brand-sage/20 bg-white py-12 sm:py-16">
      <Container className="space-y-10">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="space-y-3">
            <p className="font-serif text-2xl text-brand-moss">{siteConfig.branding.name}</p>
            <p className="max-w-sm text-sm leading-relaxed text-brand-charcoal/75">{siteConfig.branding.description}</p>
          </div>

          <FooterColumn title="Shop" links={footerGroups.shop} />
          <FooterColumn title="Explore" links={footerGroups.explore} />
          <FooterColumn title="Company" links={footerGroups.company} />
        </div>

        <div className="flex flex-col gap-3 border-t border-brand-sage/20 pt-6 text-xs text-brand-charcoal/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.branding.name}. All rights reserved.</p>
          <p>Crafted for elegant outdoor living.</p>
        </div>
      </Container>
    </footer>
  );
}

type FooterColumnProps = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <nav aria-label={title} className="space-y-3">
      <p className="text-xs uppercase tracking-[0.16em] text-brand-sage">{title}</p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm text-brand-charcoal/80 transition hover:text-brand-moss">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
