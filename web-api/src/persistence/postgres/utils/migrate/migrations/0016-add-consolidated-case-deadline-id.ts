import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex('idxConsolidatedCaseDeadlineId')
    .on('dwCaseDeadline')
    .column('consolidatedCaseDeadlineId')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('idxConsolidatedCaseDeadlineId').execute();
}
