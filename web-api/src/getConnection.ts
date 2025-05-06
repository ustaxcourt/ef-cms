import {
  CamelCasePlugin,
  CompiledQuery,
  Kysely,
  PostgresDialect,
} from 'kysely';
import { Database } from './database-schema';
import { Pool, PoolConfig } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import { environment } from './environment';
import fs from 'fs';

let dbInstance: Promise<Kysely<Database>> | null = null;
export async function getConnection<T>({
  cb,
}: {
  cb: (r: Kysely<Database>) => T;
}): Promise<T> {
  if (!dbInstance) {
    dbInstance = establishConnection();
  }
  const awaitedInstance = await dbInstance;
  const dbIsValid = await isConnectionValid(awaitedInstance);
  if (dbIsValid) {
    return await cb(awaitedInstance);
  }

  dbInstance = null;
  return getConnection({ cb });
}

async function establishConnection(): Promise<Kysely<Database>> {
  const token = await getToken();
  return connect({
    ...getPool(),
    password: token,
  });
}

export function connect(pool) {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({ ...pool }),
    }),
    plugins: [new CamelCasePlugin()],
  });
}

async function generateRDSAuthToken() {
  const signer = new Signer({
    hostname: environment.rds.pool.host,
    port: 5432,
    region: 'us-east-1', // 10502 TODO: After west is deleted use environment.region
    username: environment.rds.pool.user,
  });

  const token = await signer.getAuthToken();

  return token;
}

async function getToken() {
  if (environment.nodeEnv !== 'production') {
    return environment.rds.pool.password;
  }

  return await generateRDSAuthToken();
}

let pool: PoolConfig;

function getPool(): PoolConfig {
  if (!pool) {
    pool = {
      ...environment.rds.pool,
      ssl: environment.rds.useGlobalCert
        ? {
            ca: fs.readFileSync('global-bundle.pem').toString(),
          }
        : undefined,
    };
  }
  return pool;
}

async function isConnectionValid(db: Kysely<Database>): Promise<boolean> {
  try {
    await db.executeQuery<{ result: 1 }>(
      CompiledQuery.raw('select 1 as result', []),
    );
    return true;
  } catch (err) {
    return false;
  }
}
