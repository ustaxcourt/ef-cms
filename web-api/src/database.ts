import {
  CamelCasePlugin,
  CompiledQuery,
  Kysely,
  PostgresDialect,
} from 'kysely';
import { Database, DatabaseTableName } from './database-types';
import { Pool } from 'pg';
import { Signer } from '@aws-sdk/rds-signer';
import { environment } from './environment';
import fs from 'fs';
import { opensearchGateway } from '@web-api/gateways/opensearch/opensearchGateway';
import {
  OpensearchSyncMessage,
  TABLES_TO_OPENSEARCH_MAPPING,
  SyncMessageType,
} from '@web-api/gateways/opensearch/opensearchSyncRouter';
import { formatNow } from '@shared/business/utilities/DateHandler';
import { getLogger } from '@web-api/utilities/logger/getLogger';

export const POOL = {
  ...environment.rds.pool,
  ssl: environment.rds.useGlobalCert
    ? {
        ca: fs.readFileSync('global-bundle.pem').toString(),
      }
    : undefined,
};

const dbInstances: Record<string, Kysely<Database> | null> = {
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

async function getConnection<T>({
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
    if (dbInstances[dbKey] && (await isConnectionValid(dbInstances[dbKey]))) {
      // If valid, use the existing connection
      return await cb(dbInstances[dbKey]);
    }

    const token = await getToken(region, host);

    if (!token) {
      throw new Error('token does not exist');
    }

    dbInstances[dbKey] = connect({
      ...POOL,
      host,
      password: token,
    });

    return await cb(dbInstances[dbKey]!);
  } catch (err) {
    clearToken(region);
    const token = await getToken(region, host);

    dbInstances[dbKey] = connect({
      ...POOL,
      host,
      password: token,
    });

    return await cb(dbInstances[dbKey]!);
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
    dbKey: 'reader',
    host:
      environment.region === 'us-west-1'
        ? environment.rds.readHost
        : environment.rds.pool.host,
    region: environment.region,
  });
}

function executeWriter<T>(cb: (r: Kysely<Database>) => T): Promise<T> {
  return getConnection({
    cb,
    dbKey: 'writer',
    host: environment.rds.pool.host,
    region: 'us-east-1',
  });
}

// Prefer pgInsertInto, pgUpdateTable, pgDeleteFrom, etc.
export async function getDbWriter<T>({
  cb,
  table,
}: {
  cb: (db: Kysely<Database>) => Promise<T>;
  table: DatabaseTableName | null;
}): Promise<T> {
  if (!table || !Object.keys(TABLES_TO_OPENSEARCH_MAPPING).includes(table)) {
    return await executeWriter(cb);
  }

  const result: T = await executeWriter(cb);

  if (result) {
    try {
      const message: OpensearchSyncMessage = {
        timestamp: formatNow(),
        payload: result,
        type: table as SyncMessageType,
      };

      await opensearchGateway().queueSync({ message });
    } catch (err) {
      getLogger().error(
        'Error queuing message for opensearch from postgres',
        err,
      );
    }
  }

  return result;
}
