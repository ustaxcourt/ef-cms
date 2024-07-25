import { Database } from './database-types';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    max: 10,
    password: process.env.POSTGRES_PASSWORD || 'example',
    port: 5432,
    user: process.env.POSTGRES_USER || 'postgres',
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
