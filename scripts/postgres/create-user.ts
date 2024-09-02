import { POOL, connect } from '@web-api/database';
import { sql } from 'kysely';

const userToCreate = process.env.USER_TO_CREATE as string;
const databaseName = process.env.DATABASE_NAME as string;

if (!userToCreate) {
  throw new Error('expected USER_TO_CREATE to be defined');
}

if (!databaseName) {
  throw new Error('expected DATABASE_NAME to be defined');
}

async function grantPrivileges() {
  const db = await connect({ ...POOL });

  try {
    await sql`CREATE USER ${sql.raw(userToCreate)} WITH LOGIN;`.execute(db);
    await sql`GRANT rds_iam TO ${sql.raw(userToCreate)};`.execute(db);
    await sql`GRANT CONNECT ON DATABASE ${sql.raw(databaseName)} TO ${sql.raw(userToCreate)};`.execute(
      db,
    );
    await sql`GRANT USAGE ON SCHEMA public TO ${sql.raw(userToCreate)};`.execute(
      db,
    );
    await sql`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${sql.raw(userToCreate)};`.execute(
      db,
    );
    await sql`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${sql.raw(userToCreate)};`.execute(
      db,
    );

    console.log(`Privileges granted successfully to user ${userToCreate}.`);
  } catch (error) {
    console.error('Error granting privileges:', error);
  } finally {
    await db.destroy();
  }
}

grantPrivileges().catch(console.error);
