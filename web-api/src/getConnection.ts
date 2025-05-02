import {
  CamelCasePlugin,
  CompiledQuery,
  Kysely,
  PostgresDialect,
} from 'kysely';
import { Database } from './database-schema';
import { Pool } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import { environment } from './environment';
import fs from 'fs';

const POOL = {
  ...environment.rds.pool,
  ssl: environment.rds.useGlobalCert
    ? {
        ca: fs.readFileSync('global-bundle.pem').toString(),
      }
    : undefined,
};

let dbInstance: Kysely<Database> | null = null;

let dbToken: string | null = null;

function connect(pool) {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool(pool),
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

function clearToken() {
  dbToken = null;
}

async function getToken() {
  if (environment.nodeEnv !== 'production') {
    return environment.rds.pool.password;
  }
  const token = dbToken;

  if (!token) {
    const freshToken = await generateRDSAuthToken();
    dbToken = freshToken;
  }

  return dbToken;
}

export async function getConnection<T>({
  cb,
}: {
  cb: (r: Kysely<Database>) => T;
}): Promise<T> {
  try {
    if (dbInstance && (await isConnectionValid(dbInstance))) {
      // If valid, use the existing connection
      return await cb(dbInstance);
    }

    const token = await getToken();

    if (!token) {
      throw new Error('token does not exist');
    }

    dbInstance = connect({
      ...POOL,
      password: token,
    });

    return await cb(dbInstance);
  } catch (err) {
    clearToken();
    const token = await getToken();

    dbInstance = connect({
      ...POOL,
      password: token,
    });

    return await cb(dbInstance);
  }
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