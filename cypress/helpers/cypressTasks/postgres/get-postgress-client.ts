import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool, PoolConfig } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import { readFileSync } from 'fs';
import { Database } from '@web-api/database-types';

async function generateRDSAuthToken(hostname: string, username: string) {
  const signer = new Signer({
    hostname,
    port: 5432,
    region: 'us-east-1',
    username,
  });

  return await signer.getAuthToken();
}

function getPoolConfig(): PoolConfig {
  return {
    database: process.env.DATABASE_NAME,
    host: process.env.POSTGRES_HOST,
    idleTimeoutMillis: 1000,
    max: 1,
    password: process.env.POSTGRES_PASSWORD || 'example',
    port: 5432,
    user: process.env.POSTGRES_USER,

    ssl: {
      ca: readFileSync('global-bundle.pem').toString(),
    },
  };
}

export async function getPostgressClient(): Promise<Kysely<Database>> {
  const { POSTGRES_HOST, POSTGRES_USER } = process.env;
  const poolConfig = getPoolConfig();
  const token = await generateRDSAuthToken(POSTGRES_HOST!, POSTGRES_USER!);
  const pool = new Pool({ ...poolConfig, password: token });
  return new Kysely<any>({
    dialect: new PostgresDialect({
      pool,
    }),
    plugins: [new CamelCasePlugin()],
  });
}
