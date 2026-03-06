export type DatabaseProvider = 'postgresql';

export type DatabaseConfig = {
  provider: DatabaseProvider;
  urlEnvKey: 'DATABASE_URL';
};

export const databaseConfig: DatabaseConfig = {
  provider: 'postgresql',
  urlEnvKey: 'DATABASE_URL',
};

export function getDatabaseUrl() {
  return process.env[databaseConfig.urlEnvKey];
}

export function requireDatabaseUrl() {
  const url = getDatabaseUrl();

  if (!url) {
    throw new Error(`Missing required environment variable: ${databaseConfig.urlEnvKey}`);
  }

  return url;
}
