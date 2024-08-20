import { Database } from './database-types';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import fs from 'fs';

const connect = pool => {
  return new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool(pool),
    }),
  });
};

const pool = {
  database: 'postgres',
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

const dbWrite = connect(pool);

let dbRead: Kysely<Database>;
if (process.env.REGION === 'us-west-1') {
  dbRead = connect({ ...pool, host: process.env.POSTGRES_READ_HOST! });
} else {
  dbRead = dbWrite;
}

export { dbWrite, dbRead };
