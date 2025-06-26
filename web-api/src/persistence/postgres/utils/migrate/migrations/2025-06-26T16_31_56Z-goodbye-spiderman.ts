import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Add the docketEntryId column
  await db.schema
    .alterTable('dwWorkItem')
    .addColumn('docketEntryId', 'varchar', col => col.notNull().defaultTo(''))
    .execute();
  // Move over all data so that docketEntryId is populated
  await db
    .updateTable('dwWorkItem')
    .set({
      docketEntryId: sql<string>`docket_entry->>'docket_entry_id'`,
    })
    .execute();
  await db.schema
    .createIndex('idxWorkItemDocketEntryId')
    .on('dwWorkItem')
    .column('docketEntryId')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('idxWorkItemDocketEntryId').execute();
  await db.schema
    .alterTable('dwWorkItem')
    .dropColumn('docketEntryId')
    .execute();
}
