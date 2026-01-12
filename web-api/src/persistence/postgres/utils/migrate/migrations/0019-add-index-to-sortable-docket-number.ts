import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex('idxCaseSortableDocketNumber')
    .on('dwCase')
    .column('sortableDocketNumber')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('idxCaseSortableDocketNumber').execute();
}
