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

/**
 * The way Postgres connection handling works:
 * We have only one "main," long-lived connection connection per lambda. This makes keeping track of connections a little easier.
 * The connection needs to be long-lived so that, e.g., connections with a transaction are not expired/reset midway through the transaction.
 * (This also helps reduce the likelihood of spamming our db with connections, although this should be the responsibility of a proxy/reserved concurrency.)
 * Every connection makes a quick ping to the db for a health check. With a lambda in the same AZ as RDS, this should be extremely fast.
 */

let dbInstance: Promise<Kysely<Database>> | null = null;
let pool: Pool | null = null;
let poolConfig: PoolConfig;
export async function getConnection(): Promise<Kysely<Database>> {
  if (!dbInstance) {
    dbInstance = establishConnection();
  }
  const awaitedInstance = await dbInstance;
  return awaitedInstance;
}

export async function runQuery<T>({
  cb,
}: {
  cb: (r: Kysely<Database>) => T;
}): Promise<T> {
  const db = await getConnection();
  await checkDBHealth(db);
  return cb(db);
}

let healthCheck: Promise<any> | null = null;
async function checkDBHealth(
  db: Kysely<Database>,
  throwOnError: boolean | undefined = false,
) {
  if (!healthCheck) {
    healthCheck = db.executeQuery(CompiledQuery.raw('SELECT 1'));
  }
  try {
    await healthCheck;
  } catch (e) {
    if (throwOnError) {
      throw new DatabaseConnectionError(e);
    } else {
      healthCheck = null;
      dbInstance = null;
      const db = await getConnection();
      await checkDBHealth(db, true);
    }
  }
  healthCheck = null;
}

async function establishConnection(): Promise<Kysely<Database>> {
  try {
    // This should only ever be called by one process at a time
    poolConfig = getPoolConfig();
    await pool?.end(); // Clear existing pool
    pool = new Pool({ ...poolConfig });
    return new Kysely<Database>({
      dialect: new PostgresDialect({
        pool,
      }),
      plugins: [new CamelCasePlugin()],
    });
  } catch (e) {
    dbInstance = null;
    throw new DatabaseConnectionError(`Failed to connect to database: ${e}`);
  }
}

async function generateRDSAuthToken() {
  const signer = new Signer({
    hostname: environment.rds.pool.host,
    port: 5432,
    region: environment.region,
    username: environment.rds.pool.user,
  });

  const token = await signer.getAuthToken();

  return token;
}

async function getToken() {
  const token =
    environment.nodeEnv !== 'production'
      ? environment.rds.pool.password
      : await generateRDSAuthToken();

  return token;
}

function getPoolConfig(): PoolConfig {
  if (!poolConfig) {
    poolConfig = {
      ...environment.rds.pool,
      password: getToken,
      max: 1, // Must remain at max 1 in pool so that any locking/transaction connection stays alive.
      ssl: environment.rds.useGlobalCert
        ? {
            ca: fs.readFileSync('global-bundle.pem').toString(),
          }
        : undefined,
    };
  }
  return poolConfig;
}

export class DatabaseConnectionError extends Error {
  constructor(e?: unknown) {
    const message =
      e instanceof Error
        ? `Could not connect to database: ${e.message}`
        : `Could not connect to database: ${e}`;
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}
