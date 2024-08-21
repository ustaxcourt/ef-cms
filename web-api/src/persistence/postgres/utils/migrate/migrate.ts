import * as path from 'path';
import { FileMigrationProvider, Migrator } from 'kysely';
import { dbWrite } from '../../../../database';
import { promises as fs } from 'fs';

async function migrateToLatest() {
  const migrator = new Migrator({
    db: dbWrite,
    provider: new FileMigrationProvider({
      fs,
      migrationFolder: path.join(__dirname, 'migrations'),
      path,
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach(it => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await dbWrite.destroy();
}

migrateToLatest().catch;
