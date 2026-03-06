import 'server-only';

import { redirect } from 'next/navigation';

import { auth } from '@/auth';

type AdminSession = {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
};

function getAdminEmailAllowlist() {
  const raw = process.env.ADMIN_EMAILS ?? '';

  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    redirect('/auth/sign-in?callbackUrl=/admin');
  }

  const allowlist = getAdminEmailAllowlist();
  const isAllowed = allowlist.includes(session.user.email.toLowerCase());

  if (!isAllowed) {
    redirect('/');
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
  };
}
