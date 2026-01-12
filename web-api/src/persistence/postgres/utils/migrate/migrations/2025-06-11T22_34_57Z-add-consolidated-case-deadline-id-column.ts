import { Kysely } from 'kysely';

const TABLE_NAME = 'dwCaseDeadline';
const COLUMN_NAME = 'consolidatedCaseDeadlineId';
const CONSOLIDATED_CASE_DEADLINE_ID_INDEX = 'idx_consolidated_case_deadline_id';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable(TABLE_NAME)
    .addColumn(COLUMN_NAME, 'varchar')
    .execute();

  await db.schema
    .createIndex(CONSOLIDATED_CASE_DEADLINE_ID_INDEX)
    .on(TABLE_NAME)
    .column(COLUMN_NAME)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex(CONSOLIDATED_CASE_DEADLINE_ID_INDEX).execute();
  await db.schema.alterTable(TABLE_NAME).dropColumn(COLUMN_NAME).execute();
}
