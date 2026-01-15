import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db
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
}

export async function down(db: Kysely<any>): Promise<void> {
  await db
    .updateTable('dwDocketEntry')
    .set({
      documentType: 'Motion to Withdraw Counsel (filed by petitioner)',
    })
    .where('documentType', '=', 'Motion to Withdraw Counsel by Party')
    .execute();
}
