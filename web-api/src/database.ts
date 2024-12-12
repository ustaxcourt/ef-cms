import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
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
    plugins: [new CamelCasePlugin()],
  });
}

async function generateRDSAuthToken({ host, region }) {
  const signer = new Signer({
    hostname: host,
    port: 5432,
    region,
    username: environment.rds.pool.user,
  });

  const token = await signer.getAuthToken();

  return token;
}

function clearToken(region: string) {
  tokens[region] = null;
}

async function getToken(region: string, host: string) {
  if (environment.nodeEnv !== 'production') {
    return environment.rds.pool.password;
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

    return await cb(dbInstances[dbKey]!);
  } catch (err) {
    clearToken(region);
    const token = await getToken(region, host);
    dbInstances[dbKey] = await connect({
      ...POOL,
      host,
      password: token,
    });
    return await cb(dbInstances[dbKey]!);
  }
}

export function getDbReader<T>(cb: (r: Kysely<Database>) => T): Promise<T> {
  return createConnection({
    cb,
    dbKey: 'reader',
    host:
      environment.region === 'us-west-1'
        ? environment.rds.readHost
        : environment.rds.pool.host,
    region: environment.region,
  });
}

export function getDbWriter<T>(cb: (r: Kysely<Database>) => T): Promise<T> {
  return createConnection({
    cb,
    dbKey: 'writer',
    host: environment.rds.pool.host,
    region: 'us-east-1',
  });
}
