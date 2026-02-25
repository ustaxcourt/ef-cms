import { Kysely, sql } from 'kysely';

/**
 * Process updates in batches of 1000 rows to avoid locking large portions of
 * the table. Each batch is a separate transaction that only locks the rows
 * being updated in that batch, allowing other operations to proceed on
 * non-batched rows between transactions.
 */
const BATCH_SIZE = 1000;
const MAX_RETRIES = 3;

export async function up(db: Kysely<any>): Promise<void> {
  await updateWithBatching({
    db,
    field: 'previousDocument',
    oldValue: 'Motion to Withdraw Counsel (filed by petitioner)',
    newValue: 'Motion to Withdraw Counsel by Party',
  });

  await updateWithBatching({
    db,
    field: 'documentType',
    oldValue: 'Motion to Withdraw Counsel (filed by petitioner)',
    newValue: 'Motion to Withdraw Counsel by Party',
  });
}

export async function down(db: Kysely<any>): Promise<void> {
  await updateWithBatching({
    db,
    field: 'previousDocument',
    oldValue: 'Motion to Withdraw Counsel by Party',
    newValue: 'Motion to Withdraw Counsel (filed by petitioner)',
  });

  await updateWithBatching({
    db,
    field: 'documentType',
    oldValue: 'Motion to Withdraw Counsel by Party',
    newValue: 'Motion to Withdraw Counsel (filed by petitioner)',
  });
}

async function updateWithBatching({
  db,
  field,
  oldValue,
  newValue,
}: {
  db: Kysely<any>;
  field: 'previousDocument' | 'documentType';
  oldValue: string;
  newValue: string;
}): Promise<void> {
  let batch = 0;
  let totalUpdated = 0;
  let consecutiveErrors = 0;

  while (true) {
    batch++;

    try {
      const result =
        field === 'previousDocument'
          ? await updatePreviousDocument({ db, oldValue, newValue })
          : await updateDocumentType({ db, oldValue, newValue });

      // Note: numUpdatedRows may be undefined, so we default to 0 as a
      // fallback. We're assuming that `result` will have a `numUpdatedRows`
      // property based on Kysely's expected return type for update queries.
      const numUpdated = Number(result.numUpdatedRows || 0);
      totalUpdated += numUpdated;
      consecutiveErrors = 0;

      console.log(
        `${field} batch ${batch}: ${numUpdated} rows (total: ${totalUpdated})`,
      );

      if (numUpdated === 0) break;
    } catch (error) {
      consecutiveErrors++;
      console.error(
        `${field} batch ${batch} failed (attempt ${consecutiveErrors}/${MAX_RETRIES}):`,
        error,
      );

      if (consecutiveErrors >= MAX_RETRIES) {
        throw new Error(
          `Migration failed after ${MAX_RETRIES} consecutive errors on batch ${batch}. ${totalUpdated} rows were updated before failure.`,
        );
      }

      // Brief pause before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`${field} complete: ${totalUpdated} total rows updated`);
}

async function updatePreviousDocument({
  db,
  oldValue,
  newValue,
}: {
  db: Kysely<any>;
  oldValue: string;
  newValue: string;
}) {
  return db
    .updateTable('dwDocketEntry')
    .set({
      previousDocument: sql`jsonb_set(
        previous_document,
        '{documentType}',
        ${sql.lit(JSON.stringify(newValue))}
      )`,
    })
    .where('previousDocument', 'is not', null)
    .where(sql`previous_document->>'documentType'`, '=', oldValue)
    .where(
      'docketEntryId',
      'in',
      db
        .selectFrom('dwDocketEntry')
        .select('docketEntryId')
        .where('previousDocument', 'is not', null)
        .where(sql`previous_document->>'documentType'`, '=', oldValue)
        .orderBy('docketEntryId', 'asc')
        .limit(BATCH_SIZE),
    )
    .executeTakeFirst();
}

async function updateDocumentType({
  db,
  oldValue,
  newValue,
}: {
  db: Kysely<any>;
  oldValue: string;
  newValue: string;
}) {
  return db
    .updateTable('dwDocketEntry')
    .set({ documentType: newValue })
    .where('documentType', '=', oldValue)
    .where(
      'docketEntryId',
      'in',
      db
        .selectFrom('dwDocketEntry')
        .select('docketEntryId')
        .where('documentType', '=', oldValue)
        .orderBy('docketEntryId', 'asc')
        .limit(BATCH_SIZE),
    )
    .executeTakeFirst();
}
