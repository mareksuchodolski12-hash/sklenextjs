import Link from 'next/link';

import { auth, signOut } from '@/auth';
import { siteConfig } from '@/config/site';

import { Container } from './container';

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-40 border-b border-brand-sage/20 bg-brand-cream/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-8">
        <Link href="/" className="font-serif text-xl tracking-wide text-brand-moss">
          {siteConfig.branding.name}
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex">
          {siteConfig.navigation.main.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-brand-charcoal/80 transition hover:text-brand-moss"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/account"
            className="text-sm font-medium text-brand-charcoal/80 transition hover:text-brand-moss"
          >
            Account
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <span className="hidden text-xs text-brand-charcoal/70 sm:inline">
                {session.user.email ?? 'Signed in'}
              </span>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-brand-sage/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-moss"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/auth/sign-in"
              className="rounded-full border border-brand-moss px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-brand-moss"
            >
              Sign in
            </Link>
          )}
        </div>
      </Container>
    </header>
  );
}
