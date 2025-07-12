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
import { AsyncLocalStorage } from 'async_hooks';

type ConnectionInfo = {
  inTransaction: boolean;
  currentConnection: Kysely<Database>;
  onCommitCallbacks?: (() => Promise<void>)[];
};

// We use this to pass connection info into child processes so they know, e.g., whether or not they are in a transaction
export const ConnectionStore = new AsyncLocalStorage<ConnectionInfo>();

let dbInstance: Promise<Kysely<Database>> | null = null;
let pool: Pool | null = null;
let poolConfig: PoolConfig;
export async function getConnection(): Promise<Kysely<Database>> {
  const currentConnection = ConnectionStore.getStore()?.currentConnection;
  if (currentConnection) {
    return currentConnection;
  }

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

let tokenPromise: Promise<string> | null = null;
let token: string | null = null;
let tokenExpirationTime = 0;
export function getToken(): Promise<string> {
  if (Date.now() > tokenExpirationTime) {
    token = null;
  }
  if (token) {
    return Promise.resolve(token);
  }
  if (!tokenPromise) {
    tokenPromise = generateRDSAuthToken()
      .then(t => {
        // on success, cache the token and its expiry
        token = t;
        tokenExpirationTime = Date.now() + 13 * 60 * 1000;
        return t;
      })
      .finally(() => {
        tokenPromise = null;
      });
  }
  return tokenPromise;
}

function getPoolConfig(): PoolConfig {
  if (!poolConfig) {
    poolConfig = {
      ...environment.rds.pool,
      password: getToken,
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
