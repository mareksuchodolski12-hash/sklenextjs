import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Credentials from 'next-auth/providers/credentials';
import Email from 'next-auth/providers/email';
import GitHub from 'next-auth/providers/github';

import { prisma } from '@/lib/prisma';

const providers = [];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  );
}

if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(
    Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  );
}

const shouldUseDevCredentials = providers.length === 0 && process.env.NODE_ENV !== 'production';

if (shouldUseDevCredentials) {
  providers.push(
    Credentials({
      name: 'Development Login',
      credentials: {
        email: { label: 'Email', type: 'email' },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();

        if (!email) {
          return null;
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          return existing;
        }

        return prisma.user.create({
          data: {
            email,
            name: email.split('@')[0],
          },
        });
      },
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma as never),
  providers,
  pages: {
    signIn: '/auth/sign-in',
  },
  session: {
    strategy: shouldUseDevCredentials ? 'jwt' : 'database',
  },
  callbacks: {
    session({ session, user, token }) {
      if (session.user) {
        session.user.id = user?.id ?? token.sub ?? '';
      }

      return session;
    },
  },
});

export const authProviders = {
  github: Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET),
  email: Boolean(process.env.EMAIL_SERVER && process.env.EMAIL_FROM),
  devCredentials: shouldUseDevCredentials,
};
