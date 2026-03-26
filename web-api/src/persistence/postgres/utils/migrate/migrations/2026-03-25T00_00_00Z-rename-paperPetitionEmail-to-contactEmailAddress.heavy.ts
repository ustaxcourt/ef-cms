import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const BATCH_SIZE = 5_000;
  const PAUSE_MS = 250;
  const LOG_EVERY = 10;

  let total = 0;
  let batches = 0;

  await sql`set lock_timeout = '2s'`.execute(db);
  await sql`set statement_timeout = '10min'`.execute(db);

  while (true) {
    const rows = await db
      .selectFrom('dwCase')
      .select('docketNumber')
      .where(sql`petitioners::text`, 'like', '%paperPetitionEmail%')
      .limit(BATCH_SIZE)
      .forUpdate()
      .skipLocked()
      .execute();

    if (rows.length === 0) break;

    await sql`
      UPDATE dw_case
      SET petitioners = (
        SELECT jsonb_agg(
          CASE
            WHEN elem ? 'paperPetitionEmail'
            THEN (elem - 'paperPetitionEmail') || jsonb_build_object('contactEmailAddress', elem->'paperPetitionEmail')
            ELSE elem
          END
        )
        FROM jsonb_array_elements(petitioners) AS elem
      )
      WHERE docket_number = ANY(${rows.map(r => r.docketNumber)})
    `.execute(db);

    total += rows.length;
    batches += 1;

    if (batches % LOG_EVERY === 0) {
      console.log(
        `Rename paperPetitionEmail progress: ${total} rows updated in ${batches} batches`,
      );
    }

    if (PAUSE_MS > 0) {
      await new Promise(r => setTimeout(r, PAUSE_MS));
    }
  }

  console.log(
    `Rename paperPetitionEmail complete: ${total} rows updated in ${batches} batches`,
  );
}

export async function down(db: Kysely<any>): Promise<void> {
  const BATCH_SIZE = 5_000;
  const PAUSE_MS = 250;
  const LOG_EVERY = 10;

  let total = 0;
  let batches = 0;

  await sql`set lock_timeout = '2s'`.execute(db);
  await sql`set statement_timeout = '10min'`.execute(db);

  while (true) {
    const rows = await db
      .selectFrom('dwCase')
      .select('docketNumber')
      .where(sql`petitioners::text`, 'like', '%contactEmailAddress%')
      .limit(BATCH_SIZE)
      .forUpdate()
      .skipLocked()
      .execute();

    if (rows.length === 0) break;

    await sql`
      UPDATE dw_case
      SET petitioners = (
        SELECT jsonb_agg(
          CASE
            WHEN elem ? 'contactEmailAddress'
            THEN (elem - 'contactEmailAddress') || jsonb_build_object('paperPetitionEmail', elem->'contactEmailAddress')
            ELSE elem
          END
        )
        FROM jsonb_array_elements(petitioners) AS elem
      )
      WHERE docket_number = ANY(${rows.map(r => r.docketNumber)})
    `.execute(db);

    total += rows.length;
    batches += 1;

    if (batches % LOG_EVERY === 0) {
      console.log(
        `Revert contactEmailAddress progress: ${total} rows updated in ${batches} batches`,
      );
    }

    if (PAUSE_MS > 0) {
      await new Promise(r => setTimeout(r, PAUSE_MS));
    }
  }

  console.log(
    `Revert contactEmailAddress complete: ${total} rows updated in ${batches} batches`,
  );
}
