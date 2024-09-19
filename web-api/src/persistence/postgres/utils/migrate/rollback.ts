import * as path from 'path';
import { FileMigrationProvider, Migrator } from 'kysely';
import { promises as fs } from 'fs';
import { getDbWriter } from '../../../../database';

async function rollbackLastMigration() {
  await getDbWriter(async writer => {
    const migrator = new Migrator({
      db: writer,
      provider: new FileMigrationProvider({
        fs,
        migrationFolder: path.join(__dirname, 'migrations'),
        path,
      }),
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
  });
}

rollbackLastMigration().catch(console.error);
