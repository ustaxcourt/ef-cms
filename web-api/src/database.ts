import { Database } from './database-types';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'postgres',
    host: 'localhost',
    max: 10,
    password: 'example',
    port: 5432,
    user: 'postgres',
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
