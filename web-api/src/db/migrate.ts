import { drizzle } from 'drizzle-orm/postgres-js';
import { env } from '../env';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });
async function main() {
  await migrate(drizzle(migrationClient), {
    migrationsFolder: 'drizzle',
  });
}

main().catch(console.error);
