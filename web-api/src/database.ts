import { Database } from './database-types';
import { Kysely, PostgresDialect, SelectQueryBuilder } from 'kysely';
import { Pool } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import fs from 'fs';

const POOL = {
  database: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  idleTimeoutMillis: 1000,
  max: 1,
  port: 5432,
  ssl:
    process.env.NODE_ENV === 'production' || process.env.CIRCLE_BRANCH
      ? {
          ca: fs.readFileSync('global-bundle.pem').toString(),
        }
      : undefined,
  user: process.env.POSTGRES_USER || 'postgres',
};

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

const connect = pool => {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool(pool),
    }),
  });
};

// const dbWrite = connect(pool);

// let dbRead: Kysely<Database>;
// if (process.env.REGION === 'us-west-1') {
//   dbRead = connect({ ...pool, host: process.env.POSTGRES_READ_HOST! });
// } else {
//   dbRead = dbWrite;
// }

let reader: Kysely<Database>;
let writer: Kysely<Database>;

const tokens: Record<string, string | null> = {
  'us-east-1': null,
  'us-west-1': null,
};

function clearToken(region: string) {
  tokens[region] = null;
}

async function getToken(region: string, host: string) {
  if (process.env.NODE_ENV === 'development') {
    return process.env.POSTGRES_PASSWORD!;
  }

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

export const dbRead = async <T>(cb: (r: Kysely<Database>) => T): Promise<T> => {
  const region = process.env.REGION ?? 'us-east-1';
  const host =
    process.env.REGION === 'us-west-1'
      ? (process.env.POSTGRES_READ_HOST ?? 'localhost')
      : (process.env.POSTGRES_HOST ?? 'localhost');

  const token = await getToken(region, host);

  if (!token) {
    throw new Error('token does not exist');
  }

  try {
    reader = await connect({
      ...POOL,
      host,
      password: token,
    });
    return await cb(reader);
  } catch (err) {
    clearToken(region);
    reader = await connect({
      ...POOL,
      host,
      password: await getToken(region, host),
    });
    return await cb(reader);
  }
};

export const getDbWriter = async <T>(
  cb: (w: Kysely<Database>) => T,
): Promise<T> => {
  const region = 'us-east-1';
  const host = process.env.POSTGRES_HOST ?? 'localhost';

  const token = await getToken(region, host);

  if (!token) {
    throw new Error('token does not exist');
  }

  try {
    writer = await connect({
      ...POOL,
      host,
      password: token,
    });
    return await cb(writer);
  } catch (err) {
    clearToken(region);
    writer = await connect({
      ...POOL,
      host,
      password: await getToken(region, host),
    });
    return await cb(writer);
  }
};
