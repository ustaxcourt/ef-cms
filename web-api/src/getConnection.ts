import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Database } from './database-schema';
import { Pool, PoolConfig } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import { environment } from './environment';
import fs from 'fs';

let dbInstance: Promise<Kysely<Database>> | null = null;
let tokenExpirationTime: number = 0;
let pool: Pool | null = null;
let poolConfig: PoolConfig;
export async function getConnection<T>({
  cb,
}: {
  cb: (r: Kysely<Database>) => T;
}): Promise<T> {
  if (!dbInstance) {
    dbInstance = establishConnection();
  }

  if (Date.now() > tokenExpirationTime) {
    if (pool) {
      await resetPoolPassword();
    }
  }
  const awaitedInstance = await dbInstance;
  return await cb(awaitedInstance);
}

async function establishConnection(): Promise<Kysely<Database>> {
  try {
    poolConfig = getPoolConfig();
    let token: string | null = null;
    token = await getToken({ resetExpiration: true });
    pool = new Pool({ ...poolConfig, password: token });
    return new Kysely<Database>({
      dialect: new PostgresDialect({
        pool,
      }),
      plugins: [new CamelCasePlugin()],
    });
  } catch (e) {
    dbInstance = null;
    throw new Error(`Failed to connect to database: ${e}`);
  }
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

async function getToken({ resetExpiration }: { resetExpiration: boolean }) {
  const token =
    environment.nodeEnv !== 'production'
      ? environment.rds.pool.password
      : await generateRDSAuthToken();

  if (resetExpiration) {
    tokenExpirationTime = Date.now() + 13 * 60 * 1000; // rds auth token expires every 15min. So refresh every 13min
  }
  return token;
}

let tokenPromise: Promise<string> | null;
async function resetPoolPassword() {
  if (pool) {
    if (!tokenPromise) {
      tokenPromise = getToken({ resetExpiration: true });
    }
    let token;
    try {
      token = await tokenPromise;
      pool.options.password = token;
    } catch (e) {
      tokenExpirationTime = 0;
      throw new Error(`Could not reset db password: ${e}`);
    } finally {
      tokenPromise = null;
    }
  }
}

function getPoolConfig(): PoolConfig {
  if (!poolConfig) {
    poolConfig = {
      ...environment.rds.pool,
      ssl: environment.rds.useGlobalCert
        ? {
            ca: fs.readFileSync('global-bundle.pem').toString(),
          }
        : undefined,
    };
  }
  return poolConfig;
}

export const getScopedDbConnection = async (): Promise<{
  db: Kysely<Database>;
  destroy: () => Promise<void>;
}> => {
  const poolConfig = getPoolConfig();
  const token = await getToken({ resetExpiration: false });
  const pool = new Pool({ ...poolConfig, password: token });

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
  });

  return {
    db,
    destroy: async () => {
      await db.destroy();
    },
  };
};
