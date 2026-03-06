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
