import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db
    .updateTable('dwDocketEntry')
    .set(eb => ({ documentStorageId: eb.ref('docketEntryId') }))
    .execute();

  await db.schema
    .alterTable('dwDocketEntry')
    .alterColumn('documentStorageId', col => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwDocketEntry')
    .alterColumn('documentStorageId', col => col.dropNotNull())
    .execute();

  await db
    .updateTable('dwDocketEntry')
    .set({ documentStorageId: null })
    .execute();
}
