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
  poolConfig = getPoolConfig();
  const token = await getToken();
  pool = new Pool({ ...poolConfig, password: token });
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool,
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
  const token =
    environment.nodeEnv !== 'production'
      ? environment.rds.pool.password
      : await generateRDSAuthToken();

  tokenExpirationTime = Date.now() + 13 * 60 * 1000; // rds auth token expires every 15min. So refresh every 13min
  return token;
}

let isResettingPassword: boolean;
async function resetPoolPassword() {
  if (!isResettingPassword && pool) {
    isResettingPassword = true;
    try {
      pool.options.password = await getToken();
    } finally {
      isResettingPassword = false;
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
