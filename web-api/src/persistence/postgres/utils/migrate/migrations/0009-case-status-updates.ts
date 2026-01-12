import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwCaseStatusUpdate')
    .addColumn('statusUpdateId', 'varchar', col => col.primaryKey())
    .addColumn('changedBy', 'varchar')
    .addColumn('date', 'timestamptz')
    .addColumn('docketNumber', 'varchar')
    .addColumn('updatedCaseStatus', 'varchar')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwCaseStatusUpdate').execute();
}
