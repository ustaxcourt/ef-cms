import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Database } from '@web-api/persistence/postgres/database-schema';
import { Pool, PoolConfig } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import { environment } from '@web-api/environment';
import fs from 'fs';
import { sleep } from '@shared/tools/helpers';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

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

  if (Number(formatNow(FORMATS.UNIX_TIMESTAMP_MS)) > tokenExpirationTime) {
    if (pool) {
      await resetPoolPassword();
    }
  }
  const awaitedInstance = await dbInstance;
  return await cb(awaitedInstance);
}

// Only 1 process should be calling this function at a time.
async function establishConnection(): Promise<Kysely<Database>> {
  const maxAttempts = 3;
  let attempt = 0;
  while (attempt < maxAttempts) {
    try {
      poolConfig = getPoolConfig();
      const token = await getToken();
      const thePool = new Pool({
        ...poolConfig,
        password: token,
      });

      const client = await thePool.connect(); // Verify we can connect to the DB before continuing
      client.release();
      pool = thePool;

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
  throw new Error(
    `Failed to connect to database after ${maxAttempts} attempts`,
  );
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
    environment.stage === 'local'
      ? environment.rds.pool.password
      : await generateRDSAuthToken();

  const nowMillis = Number(formatNow(FORMATS.UNIX_TIMESTAMP_MS));
  const futureMillis = 13 * 60 * 1000; // rds auth token expires every 15min. So refresh every 13min
  tokenExpirationTime = nowMillis + futureMillis;
  return token;
}

let tokenPromise: Promise<string> | null;
async function resetPoolPassword() {
  if (pool) {
    if (!tokenPromise) {
      tokenPromise = getToken();
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
