import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { auth, authProviders, signIn } from '@/auth';
import { Container } from '@/components/layout/container';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'Sign in',
  description: 'Sign in to save favorites and manage your garden account.',
  pathname: '/auth/sign-in',
  noIndex: true,
});

type SignInPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getFirstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const session = await auth();

  const params = await searchParams;
  const callbackUrl = getFirstValue(params.callbackUrl) ?? '/account';
  const error = getFirstValue(params.error);

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <section className="py-12 sm:py-16">
      <Container className="max-w-xl">
        <div className="rounded-3xl border border-brand-sage/25 bg-white p-8 shadow-soft">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">Account access</p>
          <h1 className="mt-3 font-serif text-4xl text-brand-moss">
            Sign in to your garden account
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-brand-charcoal/75">
            Save discoveries, favorite plants, and prepare your account for future order history.
          </p>

          {error ? (
            <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              Sign-in error: {error}. Please try another method.
            </p>
          ) : null}

          <div className="mt-6 space-y-3">
            {authProviders.github ? (
              <form
                action={async () => {
                  'use server';
                  await signIn('github', { redirectTo: callbackUrl });
                }}
              >
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full border border-brand-moss px-5 py-3 text-sm font-semibold text-brand-moss transition hover:bg-brand-moss hover:text-brand-cream"
                >
                  Continue with GitHub
                </button>
              </form>
            ) : null}

            {authProviders.email ? (
              <form
                action={async (formData: FormData) => {
                  'use server';
                  const email = formData.get('email')?.toString();
                  if (!email) {
                    return;
                  }

                  await signIn('email', {
                    email,
                    redirectTo: callbackUrl,
                  });
                }}
                className="space-y-3"
              >
                <label className="block text-sm font-medium text-brand-moss" htmlFor="email">
                  Email magic link
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="h-11 w-full rounded-xl border border-brand-sage/30 px-4 text-sm text-brand-charcoal"
                  placeholder="you@example.com"
                />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-brand-moss px-5 py-3 text-sm font-semibold text-brand-cream"
                >
                  Send sign-in link
                </button>
              </form>
            ) : null}

            {authProviders.devCredentials ? (
              <form
                action={async (formData: FormData) => {
                  'use server';
                  const email = formData.get('email')?.toString();
                  if (!email) {
                    return;
                  }

                  await signIn('credentials', {
                    email,
                    redirectTo: callbackUrl,
                  });
                }}
                className="space-y-3"
              >
                <p className="text-xs uppercase tracking-[0.14em] text-brand-sage">
                  Development mode
                </p>
                <label className="block text-sm font-medium text-brand-moss" htmlFor="dev-email">
                  Quick local sign in
                </label>
                <input
                  id="dev-email"
                  name="email"
                  type="email"
                  required
                  className="h-11 w-full rounded-xl border border-brand-sage/30 px-4 text-sm text-brand-charcoal"
                  placeholder="dev@example.com"
                />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full bg-brand-moss px-5 py-3 text-sm font-semibold text-brand-cream"
                >
                  Sign in locally
                </button>
              </form>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
