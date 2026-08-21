import * as path from 'path';
import { Migrator } from 'kysely/migration';
import { getDbWriter } from '@web-api/persistence/postgres/database';
import { CjsMigrationProvider } from './CjsMigrationProvider';

async function rollbackLastMigration() {
  await getDbWriter({
    cb: async writer => {
      const migrator = new Migrator({
        db: writer,
        provider: new CjsMigrationProvider(path.join(__dirname, 'migrations')),
        allowUnorderedMigrations: true,
      });

      const { error, results } = await migrator.migrateDown();

      results?.forEach(it => {
        if (it.status === 'Success') {
          console.log(
            `migration "${it.migrationName}" was rolled back successfully`,
          );
        } else if (it.status === 'Error') {
          console.error(`failed to rollback migration "${it.migrationName}"`);
        }
      });

      if (error) {
        console.error('failed to rollback');
        console.error(error);
        process.exit(1);
      }

      await writer.destroy();
    },
    table: null,
    action: null,
  });
}

rollbackLastMigration().catch(console.error);
