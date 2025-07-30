import { Kysely, PostgresDialect } from 'kysely';
import { Database } from './database-schema';
import { Pool, PoolConfig } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import { environment } from './environment';
import fs from 'fs';

let poolConfig: PoolConfig;
export const getLockingDbConnection = async (): Promise<{
  db: Kysely<Database>;
  destroy: () => Promise<void>;
}> => {
  const poolConfig = getPoolConfig();
  const token = await getToken();
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
      max: 1, // Must remain at max 1 in pool so that the locking connection stays alive.
      idleTimeoutMillis: null, // Never expire connection as locking relies on an active connection. If connection is destroyed, so too is the lock.
      ssl: environment.rds.useGlobalCert
        ? {
            ca: fs.readFileSync('global-bundle.pem').toString(),
          }
        : undefined,
    };
  }
  return poolConfig;
}
