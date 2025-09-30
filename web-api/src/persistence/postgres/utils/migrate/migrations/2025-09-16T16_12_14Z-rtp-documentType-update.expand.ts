import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwDocketEntry')
    .addColumn('documentTypeUpdated', 'varchar')
    .execute();

  await db
    .updateTable('dwDocketEntry')
    .set(eb => ({
      documentTypeUpdated: eb
        .case()
        .when(eb('documentType', '=', 'Report'))
        .then('Expert Report')
        .else(eb.ref('documentType'))
        .end(),
    }))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwDocketEntry')
    .dropColumn('documentTypeUpdated')
    .execute();
}
