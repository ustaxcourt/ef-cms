import * as path from 'path';
import { FileMigrationProvider, Kysely, Migrator, sql } from 'kysely';
import { promises as fs } from 'fs';
import { getDbWriter } from '@web-api/database';

const migrationsDirectory = path.join(__dirname, 'migrations');
const deprecatedMigrationsDirectory = path.join(
  __dirname,
  'migrations',
  'deprecated',
);

async function migrationTableExists(db: Kysely<any>) {
  const res = await sql<{ exists: boolean }>`
    select to_regclass('kysely_migration') is not null as exists
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

  const files = await fs.readdir(deprecatedMigrationsDirectory);

  const names = files.map(f => path.basename(f, '.ts'));

  if (names.length === 0) return;

  const deletedMigrations = await db
    .deleteFrom('kyselyMigration')
    .where('name', 'in', names)
    .returning('name')
    .execute();

  console.log(
    `Pruned ${deletedMigrations.length} deprecated migration record(s):`,
    deletedMigrations,
  );
}

function createMigrator({ disableTransactions = false, writer }) {
  return new Migrator({
    db: writer,
    provider: new FileMigrationProvider({
      fs,
      migrationFolder: migrationsDirectory,
      path,
    }),
    allowUnorderedMigrations: true,
    disableTransactions,
  });
}

async function migrateToLatest(migrationType = 'expand') {
  await getDbWriter({
    cb: async writer => {
      await pruneDeprecatedMigrations(writer);

      let hasCreatedNewMigrator = false;
      let migrator = createMigrator({ writer });

      const migrations = await migrator.getMigrations();

      for (const migration of migrations) {
        const isContractMigration = migration.name.includes('.contract');
        const shouldRunMigration =
          migrationType === 'contract'
            ? isContractMigration
            : !isContractMigration;

        if (shouldRunMigration && migration.executedAt === undefined) {
          if (migration.name.includes('.heavy')) {
            console.log('Created migrator with disabledTransactions');
            migrator = createMigrator({ disableTransactions: true, writer });
            hasCreatedNewMigrator = true;
          } else if (hasCreatedNewMigrator) {
            console.log('Created migrator with Transactions');
            migrator = createMigrator({ writer });
            hasCreatedNewMigrator = false;
          }
          console.log(`Executing "${migration.name}"`);
          const { error, results } = await migrator.migrateTo(migration.name);
          results?.forEach(it => {
            if (it.status === 'Success') {
              console.log(
                `Migration "${it.migrationName}" was executed successfully`,
              );
            } else if (it.status === 'Error') {
              console.error(
                `Failed to execute migration "${it.migrationName}"`,
              );
            }
          });

          if (error) {
            console.error('Failed to migrate');
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
    console.log(
      `Postgres ${process.argv[2] ? process.argv[2] + ' ' : ''}migration completed successfully!`,
    );
    process.exit(0);
  })
  .catch(err => {
    console.log('Migration failed.');
    console.log(err);
  });
