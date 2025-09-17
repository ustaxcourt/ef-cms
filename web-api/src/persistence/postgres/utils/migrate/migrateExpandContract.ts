import * as path from 'path';
import { FileMigrationProvider, Migrator } from 'kysely';
import { promises as fs } from 'fs';
import { getDbWriter } from '../../../../database';

async function migrateToLatest(migrationType: string) {
  if (migrationType !== 'expand' && migrationType !== 'contract') {
    throw new Error(`Unable to run unknown migration type: ${migrationType}`);
  }

  await getDbWriter({
    cb: async writer => {
      const migrator = new Migrator({
        db: writer,
        provider: new FileMigrationProvider({
          fs,
          migrationFolder: path.join(__dirname, 'migrations'),
          path,
        }),
        allowUnorderedMigrations: true,
      });

      const migrations = await migrator.getMigrations();

      for (const migration of migrations) {
        if (
          migration.name.includes(`.${migrationType}`) &&
          migration.executedAt === undefined
        ) {
          const { error, results } = await migrator.migrateTo(migration.name);
          results?.forEach(it => {
            if (it.status === 'Success') {
              console.log(
                `migration "${it.migrationName}" was executed successfully`,
              );
            } else if (it.status === 'Error') {
              console.error(
                `failed to execute migration "${it.migrationName}"`,
              );
            }
          });

          if (error) {
            console.error('failed to migrate');
            console.error(error);
            process.exit(1);
          }
        }
      }

      await writer.destroy();
    },
    table: null,
    action: null,
  });
}

migrateToLatest(process.argv[2])
  .then(() => {
    // interpolate migration type here
    console.log(
      `Postgres ${process.argv[2]} migration completed Successfully!`,
    );
    process.exit(0);
  })
  .catch(err => {
    console.log('Migration failed.');
    console.log(err);
  });
