import { NextResponse } from 'next/server';

import { auth } from '@/auth';

export default auth((request) => {
  const isAccountRoute = request.nextUrl.pathname.startsWith('/account');

  if (!request.auth?.user && isAccountRoute) {
    const signInUrl = new URL('/auth/sign-in', request.nextUrl.origin);
    signInUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/account/:path*'],
};
