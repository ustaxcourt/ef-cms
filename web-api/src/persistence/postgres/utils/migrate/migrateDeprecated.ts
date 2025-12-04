import * as path from 'path';
import { FileMigrationProvider, Kysely, Migrator, sql } from 'kysely';
import { promises as fs } from 'fs';
import { getDbWriter } from '@web-api/persistence/postgres/database';

const deprecatedMigrationsDirectory = path.join(
  __dirname,
  'migrations',
  'deprecated',
);

async function migrationTableExists(db: Kysely<any>) {
  const res = await sql<{ exists: boolean }>`
    select to_regclass('kysely_migration_deprecated') is not null as exists
  `.execute(db);
  return res.rows[0]?.exists === true;
}

async function pruneDeprecatedMigrations(db: Kysely<any>) {
  if (!(await migrationTableExists(db))) {
    console.log(
      'No migration table found, exiting prune deprecated migrations',
    );
    return;
  }

  await db.deleteFrom('kyselyMigrationDeprecated').execute();

  console.log(
    `Pruned deprecated migration records from deprecated migration table`,
  );
}

async function migrateToLatest() {
  await getDbWriter({
    cb: async writer => {
      await pruneDeprecatedMigrations(writer);

      const migrator = new Migrator({
        db: writer,
        provider: new FileMigrationProvider({
          fs,
          migrationFolder: deprecatedMigrationsDirectory,
          path,
        }),
        allowUnorderedMigrations: true,
        migrationTableName: 'kysely_migration_deprecated',
        migrationLockTableName: 'kysely_migration_lock_deprecated',
      });

      const { error, results } = await migrator.migrateToLatest();

      results?.forEach(it => {
        if (it.status === 'Success') {
          console.log(
            `migration "${it.migrationName}" was executed successfully`,
          );
        } else if (it.status === 'Error') {
          console.error(`failed to execute migration "${it.migrationName}"`);
        }
      });

      if (error) {
        console.error('failed to migrate');
        console.error(error);
        process.exit(1);
      }

      await writer.destroy();
    },
    table: null,
    action: null,
  });
}

migrateToLatest()
  .then(() => {
    console.log('Postgres deprecated migration completed Successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.log('Migration failed.');
    console.log(err);
  });
