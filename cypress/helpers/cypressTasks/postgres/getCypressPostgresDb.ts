import { Signer } from '@aws-sdk/rds-signer';
import type { Database } from '@web-api/persistence/postgres/database-schema';
import { getCypressEnv } from 'cypress/helpers/env/cypressEnvironment';
import fs from 'fs';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool, PoolConfig } from 'pg';

let cachedToken = '';

export async function getCypressPostgresDb() {
  const token = await getToken();
  const connection = connect({
    ...POOL,
    password: token,
  });
  return connection;
}

const POOL = {
  ...getCypressEnv().rds.pool,
  ssl: getCypressEnv().rds.useGlobalCert
    ? {
        ca: fs.readFileSync('global-bundle.pem').toString(),
      }
    : undefined,
};

async function getToken() {
  if (getCypressEnv().env === 'local') {
    return getCypressEnv().rds.pool.password;
  }

  if (!cachedToken) {
    cachedToken = await generateRDSAuthToken();
  }

  return cachedToken;
}

async function generateRDSAuthToken() {
  const signer = new Signer({
    hostname: getCypressEnv().rds.pool.host,
    port: 5432,
    region: getCypressEnv().region,
    username: getCypressEnv().rds.pool.user,
  });

  const token = await signer.getAuthToken();

  return token;
}

function connect(pool: PoolConfig) {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool(pool),
    }),
    plugins: [new CamelCasePlugin()],
  });
}
