import { CopyObjectCommand } from '@aws-sdk/client-s3';
import { getUniqueId } from '@shared/sharedAppContext';
import { environment } from '@web-api/environment';
import { getStorageClient } from '@web-api/persistence/s3/getStorageClient';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { Kysely, sql } from 'kysely';
import { chunk } from 'lodash';

export async function up(db: Kysely<any>): Promise<void> {
  const BATCH_SIZE = 400;
  const BACKFILL_BATCH_SIZE = 5_000;
  const PAUSE_MS = 250;
  const LOG_EVERY = 10;

  let total = 0;
  let batches = 0;

  await sql`set lock_timeout = '2s'`.execute(db);

  await sql`set statement_timeout = '10min'`.execute(db);

  console.time('Duration of adding multiDocketedOn column with jsonb default');
  await db.schema
    .alterTable('dwDocketEntry')
    .addColumn('multiDocketedOn', 'jsonb', col =>
      col.defaultTo(sql`'[]'::jsonb`),
    )
    .execute();

  console.timeEnd(
    'Duration of adding multiDocketedOn column with jsonb default',
  );

  await db.schema
    .alterTable('dwDocketEntry')
    .addColumn('originallyFiledDocketNumber', 'varchar')
    .execute();

  // Create INSERT trigger so that during blue-green deployment, rows inserted by old
  // code (which doesn't set originallyFiledDocketNumber) are corrected by recomputing
  // the earliest docket number across all rows sharing the same docket_entry_id.
  await sql`
    create or replace function dw_docket_entry_originally_filed_insert_trigger()
    returns trigger as $$
    declare
      computed_original varchar;
    begin
      select (
        array_agg(docket_number order by
          case
            when split_part(docket_number, '-', 2)::int >= 65
              then 1900 + split_part(docket_number, '-', 2)::int
            else 2000 + split_part(docket_number, '-', 2)::int
          end,
          split_part(docket_number, '-', 1)::int
        )
      )[1]
      into computed_original
      from dw_docket_entry
      where docket_entry_id = new.docket_entry_id;

      update dw_docket_entry
      set originally_filed_docket_number = computed_original
      where docket_entry_id = new.docket_entry_id
        and originally_filed_docket_number is distinct from computed_original;

      return new;
    end;
    $$ language plpgsql
  `.execute(db);

  await sql`
    create trigger dw_docket_entry_originally_filed_after_insert
    after insert on dw_docket_entry
    for each row execute function dw_docket_entry_originally_filed_insert_trigger()
  `.execute(db);

  // Backfill originallyFiledDocketNumber:
  // Default all entries to their own docketNumber in batches.
  console.time('Duration of backfilling originallyFiledDocketNumber');
  while (true) {
    const ctids = await db
      .selectFrom('dwDocketEntry')
      .select(sql`ctid`.as('ctid'))
      .where('originallyFiledDocketNumber', 'is', null)
      .limit(BACKFILL_BATCH_SIZE)
      .forUpdate()
      .skipLocked()
      .execute();

    if (ctids.length === 0) break;

    const updatedRows = await db
      .updateTable('dwDocketEntry')
      .set(eb => ({ originallyFiledDocketNumber: eb.ref('docketNumber') }))
      .where(
        sql`ctid`,
        'in',
        ctids.map(row => row.ctid),
      )
      .returning('ctid')
      .execute();

    total += updatedRows.length;
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

  console.timeEnd('Duration of backfilling originallyFiledDocketNumber');
  console.log(`Backfill complete: ${total} rows updated in ${batches} batches`);

  let recordsToUpdate: any = await db
    .selectFrom(
      db
        .selectFrom('dwDocketEntry')
        .select([
          'docketEntryId',
          'docketNumber',
          'documentStorageId',
          sql<number>`count(*) over (partition by docket_entry_id)`.as(
            'docketEntryCount',
          ),
          sql<string>`
                (
                  array_agg(docket_number) over (
                    partition by docket_entry_id
                    order by
                      case
                        when split_part(docket_number, '-', 2)::int >= 65
                          then 1900 + split_part(docket_number, '-', 2)::int
                        else 2000 + split_part(docket_number, '-', 2)::int
                      end,
                      split_part(docket_number, '-', 1)::int
                    rows between unbounded preceding and unbounded following
                  )
                )[1]
              `.as('originallyFiledDocketNumber'),
        ])
        .as('subquery'),
    )
    .select(['docketEntryId', 'docketNumber', 'documentStorageId'])
    .where('docketEntryCount', '>', 1)
    .where(eb =>
      eb('originallyFiledDocketNumber', '!=', eb.ref('docketNumber')),
    )
    .execute();

  console.log(`Records to Update: ${recordsToUpdate.length}`);

  recordsToUpdate = chunk(recordsToUpdate, BATCH_SIZE);

  console.log(`# of chunks of batches: ${recordsToUpdate.length}`);

  const storageClient = getStorageClient();

  for (const recordsInChunk of recordsToUpdate) {
    console.time('Duration of processing one batch');
    const updateDbPromises: Promise<any>[] = [];
    const updateS3Promises: Promise<any>[] = [];

    for (const record of recordsInChunk) {
      const newStorageId = getUniqueId();

      const changeDbValues = db
        .updateTable('dwDocketEntry')
        .set({
          documentStorageId: newStorageId,
        })
        .where('docketNumber', '=', record.docketNumber)
        .where('docketEntryId', '=', record.docketEntryId)
        .execute();

      const storageCommand = new CopyObjectCommand({
        Bucket: environment.documentsBucketName,
        CopySource: `${environment.documentsBucketName}/${record.docketEntryId}`,
        Key: newStorageId,
      });

      updateDbPromises.push(changeDbValues);
      updateS3Promises.push(storageClient.send(storageCommand));
    }

    await settlePromises(updateDbPromises);
    await settlePromises(updateS3Promises);
    console.timeEnd('Duration of processing one batch');
    console.log('*Finished a batch*');
  }

  await sql`
    alter table "dw_docket_entry"
    add constraint "dw_docket_entry_multi_docketed_on_nn"
    check ("multi_docketed_on" is not null) not valid
  `.execute(db);

  await sql`
    alter table "dw_docket_entry"
    validate constraint "dw_docket_entry_multi_docketed_on_nn"
  `.execute(db);

  await db.schema
    .alterTable('dwDocketEntry')
    .alterColumn('multiDocketedOn', col => col.setNotNull())
    .execute();

  await db.schema
    .alterTable('dwDocketEntry')
    .dropConstraint('dwDocketEntry_multiDocketedOn_nn')
    .execute();

  // Create UPDATE trigger AFTER backfill to avoid recomputing on every backfill update.
  // Handles unconsolidation during blue-green deployment: when old code updates a row
  // without touching originallyFiledDocketNumber, this trigger recomputes the correct value.
  await sql`
    create or replace function dw_docket_entry_originally_filed_update_trigger()
    returns trigger as $$
    declare
      computed_original varchar;
    begin
      select (
        array_agg(docket_number order by
          case
            when split_part(docket_number, '-', 2)::int >= 65
              then 1900 + split_part(docket_number, '-', 2)::int
            else 2000 + split_part(docket_number, '-', 2)::int
          end,
          split_part(docket_number, '-', 1)::int
        )
      )[1]
      into computed_original
      from dw_docket_entry
      where docket_entry_id = new.docket_entry_id;

      if new.originally_filed_docket_number is distinct from computed_original then
        new.originally_filed_docket_number := computed_original;
      end if;

      return new;
    end;
    $$ language plpgsql
  `.execute(db);

  await sql`
    create trigger dw_docket_entry_originally_filed_before_update
    before update on dw_docket_entry
    for each row execute function dw_docket_entry_originally_filed_update_trigger()
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    drop trigger if exists dw_docket_entry_originally_filed_after_insert on dw_docket_entry
  `.execute(db);

  await sql`
    drop trigger if exists dw_docket_entry_originally_filed_before_update on dw_docket_entry
  `.execute(db);

  await sql`
    drop function if exists dw_docket_entry_originally_filed_insert_trigger()
  `.execute(db);

  await sql`
    drop function if exists dw_docket_entry_originally_filed_update_trigger()
  `.execute(db);

  await db.schema
    .alterTable('dwDocketEntry')
    .dropColumn('multiDocketedOn')
    .execute();

  await db.schema
    .alterTable('dwDocketEntry')
    .dropColumn('originallyFiledDocketNumber')
    .execute();

  const BATCH_SIZE = 5_000;
  const PAUSE_MS = 250;
  const LOG_EVERY = 10;

  let total = 0;
  let batches = 0;

  await sql`set lock_timeout = '2s'`.execute(db);

  await sql`set statement_timeout = '10min'`.execute(db);

  while (true) {
    const records = await db
      .selectFrom('dwDocketEntry')
      .select(['docketNumber', 'docketEntryId'])
      .where(eb => eb('documentStorageId', '!=', eb.ref('docketEntryId')))
      .limit(BATCH_SIZE)
      .forUpdate()
      .skipLocked()
      .execute();

    if (records.length === 0) break;

    const updatedRows = await db
      .updateTable('dwDocketEntry')
      .set(eb => ({ documentStorageId: eb.ref('docketEntryId') }))
      .where(eb =>
        eb.or(
          records.map(r =>
            eb.and([
              eb('docketNumber', '=', r.docketNumber),
              eb('docketEntryId', '=', r.docketEntryId),
            ]),
          ),
        ),
      )
      .returning(['docketNumber', 'docketEntryId'])
      .execute();

    const updated = updatedRows.length;

    total += updated;
    batches += 1;

    if (batches % LOG_EVERY === 0) {
      console.log(
        `Backfill revert progress: ${total} rows updated in ${batches} batches`,
      );
    }

    if (PAUSE_MS > 0) {
      await new Promise(r => setTimeout(r, PAUSE_MS));
    }
  }

  console.log(
    `Backfill revert complete: ${total} rows updated in ${batches} batches`,
  );
}
