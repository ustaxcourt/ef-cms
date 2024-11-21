import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwCaseStatusUpdate')
    .addColumn('changedBy', 'varchar')
    .addColumn('date', 'timestamptz')
    .addColumn('docketNumber', 'varchar')
    .addColumn('updatedCaseStatus', 'varchar')
    .addPrimaryKeyConstraint('pk_case_status_update', ['docketNumber', 'date'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwCaseStatusUpdate').execute();
}
