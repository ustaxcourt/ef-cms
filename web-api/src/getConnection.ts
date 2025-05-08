import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Database } from './database-schema';
import { Pool, PoolConfig } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import { environment } from './environment';
import fs from 'fs';

const TOKEN_REFRESH_RATE = 13 * 60 * 1000;

let dbInstance: Promise<Kysely<Database>> | null = null;
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
  const awaitedInstance = await dbInstance;
  return await cb(awaitedInstance);
}

async function establishConnection(): Promise<Kysely<Database>> {
  poolConfig = getPoolConfig();
  const token = await getToken();
  pool = new Pool({ ...poolConfig, password: token });
  // To avoid expired token on a long running warm lambda, refresh periodically
  setInterval(async () => {
    await resetPoolPassword();
  }, TOKEN_REFRESH_RATE);
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
  if (environment.nodeEnv !== 'production') {
    return environment.rds.pool.password;
  }

  return await generateRDSAuthToken();
}

async function resetPoolPassword() {
  if (pool) {
    pool.options.password = await getToken();
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
