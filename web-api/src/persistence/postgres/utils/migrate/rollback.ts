import * as path from 'path';
import { FileMigrationProvider, Migrator } from 'kysely';
import { dbWrite } from '../../../../database';
import { promises as fs } from 'fs';

async function rollbackLastMigration() {
  const migrator = new Migrator({
    db: dbWrite,
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

  await dbWrite.destroy();
}

rollbackLastMigration().catch(console.error);
