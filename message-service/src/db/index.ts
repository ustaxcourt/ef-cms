import * as schema from './schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../env';
import postgres from 'postgres';

export const client = postgres(env.DATABASE_URL);
export const db = drizzle(client, { schema });
