import { CamelCasePlugin, Kysely, PostgresDialect, Transaction } from 'kysely';
import { Database } from '@web-api/persistence/postgres/database-schema';
import { Pool, PoolConfig } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import { environment } from '../../environment';
import fs from 'fs';
import { AsyncLocalStorage } from 'async_hooks';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { sleep } from '@shared/tools/helpers';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

const CONNECTION_RETRY_COUNT = 3;

export type ConnectionInfo = {
  currentTransaction: Transaction<Database>;
  onCommitCallbacks?: (() => Promise<void>)[];
};

// We use this to pass connection info into child processes so they know, e.g., whether or not they are in a transaction
export const ConnectionStore = new AsyncLocalStorage<ConnectionInfo>();

let dbInstance: Promise<Kysely<Database>> | null = null;
let pool: Pool | null = null;
let poolConfig: PoolConfig;

export async function getDb(): Promise<Kysely<Database>> {
  const currentConnection = ConnectionStore.getStore()?.currentTransaction;
  if (currentConnection) {
    return currentConnection;
  }

  if (!dbInstance) {
    dbInstance = establishDbPool();
  }

  const awaitedInstance = await dbInstance;
  return awaitedInstance;
}

export async function runQuery<T>({
  cb,
}: {
  cb: (r: Kysely<Database>) => T;
}): Promise<T> {
  const db = await getDb();
  return cb(db);
}

// This should only ever be called by one process at a time
async function establishDbPool(): Promise<Kysely<Database>> {
  let attempt = 0;
  while (attempt < CONNECTION_RETRY_COUNT) {
    try {
      poolConfig = getPoolConfig();
      await pool?.end(); // Clear existing pool
      const pendingPool = new Pool({ ...poolConfig });

      const client = await pendingPool.connect(); // Verify we can connect to the DB before continuing
      client.release();
      pool = pendingPool;

      return new Kysely<Database>({
        dialect: new PostgresDialect({
          pool,
        }),
        plugins: [new CamelCasePlugin()],
      });
    } catch (e) {
      attempt++;
      getDawsonLogger().error(
        `Error establishing connection with database on attempt ${attempt}`,
        e,
      );
      await sleep(20 * 2 ** attempt);
    }
  }
  dbInstance = null;
  throw new DatabaseConnectionError(
    `Failed to connect to database after 3 attempts`,
  );
}

async function generateRDSAuthToken(): Promise<string> {
  const signer = new Signer({
    hostname: environment.rds.pool.host,
    port: 5432,
    region: environment.region,
    username: environment.rds.pool.user,
  });

  const token = await signer.getAuthToken();

  return token;
}

let tokenPromise: Promise<string> | null = null; // So parallel processes don't all try to get a token at the same time
let token: string | null = null;
let tokenExpirationTime = 0;
async function getToken(): Promise<string> {
  if (environment.stage === 'local') {
    return environment.rds.pool.password;
  }
  // Unset the token if we are past the expiration time
  if (Number(formatNow(FORMATS.UNIX_TIMESTAMP_MS)) > tokenExpirationTime) {
    token = null;
  }
  // If we still have a valid token, return it
  if (token) {
    return token;
  }
  // We get a new token, careful to make sure concurrent processes all wait for the same call to generateRDSAuthToken
  if (!tokenPromise) {
    // "Lock" the token fetching code by setting tokenPromise
    tokenPromise = generateRDSAuthToken()
      .then(t => {
        // On success, cache the token and its expiration time
        token = t;
        tokenExpirationTime = Number(formatNow(FORMATS.UNIX_TIMESTAMP_MS)) + 13 * 60 * 1000;
        return t;
      })
      .finally(() => {
        tokenPromise = null; // "Unlock" the token fetching code by unsetting tokenPromise
      });
  }
  return await tokenPromise;
}

function getPoolConfig(): PoolConfig {
  if (!poolConfig) {
    poolConfig = {
      ...environment.rds.pool,
      password: () => getToken(),
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

export const exportedForTesting = {
  getToken,
};
