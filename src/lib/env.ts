import { databaseConfig } from '@/lib/database';

const requiredInProduction = [databaseConfig.urlEnvKey] as const;

export function validateServerEnv() {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const missing = requiredInProduction.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
