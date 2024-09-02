import { Database } from './database-types';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import fs from 'fs';

export const POOL = {
  database: process.env.DATABASE_NAME || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  idleTimeoutMillis: 1000,
  max: 1,
  password: process.env.POSTGRES_PASSWORD || 'example',
  port: 5432,
  ssl:
    process.env.NODE_ENV === 'production' || process.env.CIRCLE_BRANCH
      ? {
          ca: fs.readFileSync('global-bundle.pem').toString(),
        }
      : undefined,
  user: process.env.POSTGRES_USER || 'postgres',
};

let dbInstances: Record<string, Kysely<Database> | null> = {
  reader: null,
  writer: null,
};

const tokens: Record<string, string | null> = {
  'us-east-1': null,
  'us-west-1': null,
};

export function connect(pool) {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool(pool),
    }),
  });
}

async function generateRDSAuthToken({ host, region }) {
  const signer = new Signer({
    hostname: host,
    port: 5432,
    // credentials: fromNodeCredentialProvider(),
    region,

    username: process.env.POSTGRES_USER || 'postgres',
    // sha256: HashCtor,
  });

  const token = await signer.getAuthToken();

  return token;
}

function clearToken(region: string) {
  tokens[region] = null;
}

async function getToken(region: string, host: string) {
  const token = tokens[region];

  if (!token) {
    const freshToken = await generateRDSAuthToken({
      host,
      region,
    });
    tokens[region] = freshToken;
  }

  return tokens[region];
}

async function createConnection<T>({
  cb,
  dbKey,
  host,
  region,
}: {
  dbKey: string;
  cb: (r: Kysely<Database>) => T;
  region: string;
  host: string;
}): Promise<T> {
  try {
    const token = await getToken(region, host);

    if (!token) {
      throw new Error('token does not exist');
    }

    dbInstances[dbKey] = await connect({
      ...POOL,
      host,
      password: token,
    });

    return await cb(dbInstances[dbKey]);
  } catch (err) {
    clearToken(region);
    const token = await getToken(region, host);
    dbInstances[dbKey] = await connect({
      ...POOL,
      host,
      password: token,
    });
    return await cb(dbInstances[dbKey]);
  }
}

export function getDbReader<T>(cb: (r: Kysely<Database>) => T): Promise<T> {
  return createConnection({
    cb,
    dbKey: 'reader',
    host:
      process.env.REGION === 'us-west-1'
        ? process.env.POSTGRES_READ_HOST!
        : (process.env.POSTGRES_HOST ?? 'localhost'),
    region: process.env.REGION ?? 'us-east-1',
  });
}

export function getDbWriter<T>(cb: (r: Kysely<Database>) => T): Promise<T> {
  return createConnection({
    cb,
    dbKey: 'writer',
    host: process.env.POSTGRES_HOST ?? 'localhost',
    region: 'us-east-1',
  });
}
