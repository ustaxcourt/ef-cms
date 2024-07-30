import { Database } from './database-types';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import fs from 'fs';

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    idleTimeoutMillis: 1000,
    max: 10,
    password: process.env.POSTGRES_PASSWORD || 'example',
    port: 5432,
    ssl:
      process.env.NODE_ENV === 'production' || process.env.CIRCLE_BRANCH
        ? {
            ca: fs.readFileSync('us-east-1-bundle.pem').toString(),
          }
        : undefined,
    user: process.env.POSTGRES_USER || 'postgres',
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
