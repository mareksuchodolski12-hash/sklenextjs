import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { Container } from '@/components/layout/container';
import { getAccountShellData } from '@/server/account/queries';

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/auth/sign-in?callbackUrl=/account');
  }

  const shellData = await getAccountShellData(session.user.id);

  return (
    <section className="py-12 sm:py-16">
      <Container className="space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-sage">My account</p>
          <h1 className="font-serif text-4xl text-brand-moss sm:text-5xl">Welcome back</h1>
          <p className="text-sm text-brand-charcoal/75 sm:text-base">
            Signed in as <span className="font-semibold text-brand-moss">{session.user.email}</span>
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <AccountCard
            title="Saved favorites"
            value={shellData.favoritesCount}
            description="Plants you marked to revisit later."
          />
          <AccountCard
            title="Saved discoveries"
            value={shellData.savedDiscoveriesCount}
            description="Discovery studio results tied to your account."
          />
          <AccountCard
            title="Order history"
            value="Coming soon"
            description="Prepared shell for future checkout integration."
          />
        </div>
      </Container>
    </section>
  );
}

function AccountCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number | string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-brand-sage/20 bg-white p-6 shadow-soft">
      <p className="text-xs uppercase tracking-[0.14em] text-brand-sage">{title}</p>
      <p className="mt-3 font-serif text-3xl text-brand-moss">{value}</p>
      <p className="mt-2 text-sm text-brand-charcoal/75">{description}</p>
    </article>
  );
}
