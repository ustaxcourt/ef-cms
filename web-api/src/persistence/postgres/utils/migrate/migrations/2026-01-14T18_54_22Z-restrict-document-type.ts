import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.transaction().execute(async trx => {
    // Update previousDocument.documentType where it matches
    await trx
      .updateTable('dwDocketEntry')
      .set({
        previousDocument: sql`jsonb_set(
          "previousDocument",
          '{documentType}',
          '"Motion to Withdraw Counsel by Party"'
        )`,
      })
      .where(
        sql`"previousDocument"->>'documentType'`,
        '=',
        'Motion to Withdraw Counsel (filed by petitioner)',
      )
      .execute();

    // Update documentType column where it matches
    await trx
      .updateTable('dwDocketEntry')
      .set({
        documentType: 'Motion to Withdraw Counsel by Party',
      })
      .where(
        'documentType',
        '=',
        'Motion to Withdraw Counsel (filed by petitioner)',
      )
      .execute();
  });
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.transaction().execute(async trx => {
    // Update previousDocument.documentType where it matches
    await trx
      .updateTable('dwDocketEntry')
      .set({
        previousDocument: sql`jsonb_set(
          "previousDocument",
          '{documentType}',
          '"Motion to Withdraw Counsel (filed by petitioner)"'
        )`,
      })
      .where(
        sql`"previousDocument"->>'documentType'`,
        '=',
        'Motion to Withdraw Counsel by Party',
      )
      .execute();

    // Update documentType column where it matches
    await trx
      .updateTable('dwDocketEntry')
      .set({
        documentType: 'Motion to Withdraw Counsel (filed by petitioner)',
      })
      .where('documentType', '=', 'Motion to Withdraw Counsel by Party')
      .execute();
  });
}
