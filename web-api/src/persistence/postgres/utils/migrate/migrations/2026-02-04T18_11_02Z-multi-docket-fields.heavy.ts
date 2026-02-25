import { CopyObjectCommand } from '@aws-sdk/client-s3';
import { getUniqueId } from '@shared/sharedAppContext';
import { environment } from '@web-api/environment';
import { getStorageClient } from '@web-api/persistence/s3/getStorageClient';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { Kysely, sql } from 'kysely';
import { chunk } from 'lodash';

export async function up(db: Kysely<any>): Promise<void> {
  const BATCH_SIZE = 400;
  // const PAUSE_MS = 250;

  await sql`set lock_timeout = '2s'`.execute(db);

  await sql`set statement_timeout = '3min'`.execute(db);

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

  // if (PAUSE_MS > 0) {
  //   await new Promise(r => setTimeout(r, PAUSE_MS));
  // }
  // }

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
}

export async function down(db: Kysely<any>): Promise<void> {
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
