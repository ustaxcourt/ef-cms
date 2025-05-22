import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .addColumn('manuallyAddedToTrial', 'boolean', col => col.defaultTo(false))
    .execute();

  await db.schema
    .createIndex('idxManuallyAddedToTrial')
    .on('dwCase')
    .column('manuallyAddedToTrial')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .dropColumn('manuallyAddedToTrial')
    .execute();

  await db.schema.dropIndex('idxManuallyAddedToTrial').execute();
}
