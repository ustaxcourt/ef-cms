import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .addColumn('addedToTrialSession', 'boolean', col => col.defaultTo(false))
    .execute();

  await db.schema
    .createIndex('idxAddedToTrialSession')
    .on('dwCase')
    .column('addedToTrialSession')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .dropColumn('addedToTrialSession')
    .execute();

  await db.schema.dropIndex('idxAddedToTrialSession').execute();
}
