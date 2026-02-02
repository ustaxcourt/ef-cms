import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const BATCH_SIZE = 20_000;
  const PAUSE_MS = 150;
  const LOG_EVERY = 10;

  let total = 0;
  let batches = 0;

  await sql`set lock_timeout = '2s'`.execute(db);

  await sql`set statement_timeout = '10min'`.execute(db);

  while (true) {
    const ctids = await db
      .selectFrom('dwDocketEntry')
      .select(sql`ctid`.as('ctid'))
      .where('documentStorageId', 'is', null)
      .limit(BATCH_SIZE)
      .forUpdate()
      .skipLocked()
      .execute();

    if (ctids.length === 0) break;

    const updatedRows = await db
      .updateTable('dwDocketEntry')
      .set(eb => ({ documentStorageId: eb.ref('docketEntryId') }))
      .where(
        sql`ctid`,
        'in',
        ctids.map(r => r.ctid),
      )
      .returning('ctid')
      .execute();

    const updated = updatedRows.length;

    total += updated;
    batches += 1;

    if (batches % LOG_EVERY === 0) {
      console.log(
        `Backfill progress: ${total} rows updated in ${batches} batches`,
      );
    }

    if (PAUSE_MS > 0) {
      await new Promise(r => setTimeout(r, PAUSE_MS));
    }
  }

  console.log(`Backfill complete: ${total} rows updated in ${batches} batches`);

  await sql`
    alter table "dw_docket_entry"
    add constraint "dw_docket_entry_document_storage_id_nn"
    check ("document_storage_id" is not null) not valid
  `.execute(db);

  // Validate the constraint (scans table; allows concurrent reads/writes).
  await sql`
    alter table "dw_docket_entry"
    validate constraint "dw_docket_entry_document_storage_id_nn"
  `.execute(db);

  // Flip to NOT NULL (brief AccessExclusive lock to change catalog).
  await db.schema
    .alterTable('dwDocketEntry')
    .alterColumn('documentStorageId', col => col.setNotNull())
    .execute();

  // Drop the check constraint once NOT NULL is set.
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
