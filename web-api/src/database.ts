import {
  CamelCasePlugin,
  CompiledQuery,
  Kysely,
  PostgresDialect,
} from 'kysely';
import { Database } from './database-types';
import { Pool } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import { environment } from './environment';
import fs from 'fs';

export const POOL = {
  ...environment.rds.pool,
  ssl: environment.rds.useGlobalCert
    ? {
        ca: fs.readFileSync('global-bundle.pem').toString(),
      }
    : undefined,
};

let dbInstance: Kysely<Database> | null = null;

let dbToken: string | null = null;

export function connect(pool) {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool(pool),
    }),
    plugins: [new CamelCasePlugin()],
  });
}

async function generateRDSAuthToken({ host }) {
  const signer = new Signer({
    hostname: host,
    port: 5432,
    region: environment.region,
    username: environment.rds.pool.user,
  });

  const token = await signer.getAuthToken();

  return token;
}

function clearToken() {
  dbToken = null;
}

async function getToken(host: string): Promise<string> {
  if (environment.nodeEnv !== 'production') {
    return environment.rds.pool.password;
  }

  if (!dbToken) {
    const freshToken = await generateRDSAuthToken({
      host,
    });
    dbToken = freshToken;
  }

  return dbToken;
}

async function getConnection<T>({
  cb,
  host,
}: {
  cb: (r: Kysely<Database>) => T;
  host: string;
}): Promise<T> {
  try {
    if (dbInstance && (await isConnectionValid(dbInstance))) {
      // If valid, use the existing connection
      return await cb(dbInstance);
    }

    const token = await getToken(host);

    if (!token) {
      throw new Error('token does not exist');
    }

    dbInstance = connect({
      ...POOL,
      host,
      password: token,
    });

    return await cb(dbInstance!);
  } catch (err) {
    clearToken();
    const token = await getToken(host);

    dbInstance = connect({
      ...POOL,
      host,
      password: token,
    });

    return await cb(dbInstance!);
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

export function getDbReader<T>(cb: (r: Kysely<Database>) => T): Promise<T> {
  return getConnection({
    cb,
    host: environment.rds.pool.host,
  });
}

export function getDbWriter<T>(cb: (r: Kysely<Database>) => T): Promise<T> {
  return getConnection({
    cb,
    host: environment.rds.pool.host,
  });
}
