import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwDocketEntryWorksheet')
    .addColumn('docketEntryId', 'varchar', col => col.primaryKey())
    .addColumn('finalBriefDueDate', 'timestamptz')
    .addColumn('primaryIssue', 'varchar')
    .addColumn('statusOfMatter', 'varchar')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwDocketEntryWorksheet').execute();
}
