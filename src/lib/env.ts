import { databaseConfig } from '@/lib/database';

const requiredInProduction = [databaseConfig.urlEnvKey, 'AUTH_SECRET'] as const;

export function validateServerEnv() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const missing = requiredInProduction.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  const hasGithub = Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET);
  const hasEmail = Boolean(process.env.EMAIL_SERVER && process.env.EMAIL_FROM);

  if (!hasGithub && !hasEmail) {
    throw new Error(
      'At least one auth provider must be configured in production (GitHub OAuth or Email magic link).',
    );
  }
}

export function assertDatabaseEnv() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required for Prisma and PostgreSQL connectivity.');
  }
}
