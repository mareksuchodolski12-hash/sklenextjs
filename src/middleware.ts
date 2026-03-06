import { NextResponse } from 'next/server';

import { auth } from '@/auth';

function getAdminEmailAllowlist() {
  const raw = process.env.ADMIN_EMAILS ?? '';

  return raw
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export default auth((request) => {
  const pathname = request.nextUrl.pathname;
  const isAccountRoute = pathname.startsWith('/account');
  const isAdminRoute = pathname.startsWith('/admin');

  if (!request.auth?.user && (isAccountRoute || isAdminRoute)) {
    const signInUrl = new URL('/auth/sign-in', request.nextUrl.origin);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAdminRoute) {
    const email = request.auth?.user?.email?.toLowerCase();
    const allowlist = getAdminEmailAllowlist();

    if (!email || !allowlist.includes(email)) {
      return NextResponse.redirect(new URL('/', request.nextUrl.origin));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};
