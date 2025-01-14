import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwCaseStatusUpdate')
    .addColumn('changedBy', 'varchar')
    .addColumn('date', 'timestamptz')
    .addColumn('docketNumber', 'varchar')
    .addColumn('updatedCaseStatus', 'varchar')
    .addPrimaryKeyConstraint('pkCaseStatusUpdate', ['docketNumber', 'date'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwCaseStatusUpdate').execute();
}
