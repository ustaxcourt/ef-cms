import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db
    .updateTable('dwDocketEntry')
    .set(eb => ({ documentStorageId: eb.ref('docketEntryId') }))
    .execute();

  await sql`
    alter table "dw_docket_entry"
    add constraint "dw_docket_entry_document_storage_id_nn"
    check ("document_storage_id" is not null) not valid
  `.execute(db);

  // 3) Validate the constraint (scans table; allows concurrent reads/writes).
  await sql`
    alter table "dw_docket_entry"
    validate constraint "dw_docket_entry_document_storage_id_nn"
  `.execute(db);

  // 4) Now flip to NOT NULL (brief AccessExclusive lock to change catalog).
  await db.schema
    .alterTable('dwDocketEntry')
    .alterColumn('documentStorageId', col => col.setNotNull())
    .execute();

  // 5) Drop the check constraint once NOT NULL is set.
  await db.schema
    .alterTable('dwDocketEntry')
    .dropConstraint('dwDocketEntry_documentStorageId_nn')
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
