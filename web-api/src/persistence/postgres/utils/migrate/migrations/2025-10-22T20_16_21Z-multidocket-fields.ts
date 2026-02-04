import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // await db.schema
  //   .alterTable('dwDocketEntry')
  //   .addColumn('multiDocketedOn', 'jsonb', col =>
  //     col.defaultTo(JSON.stringify([])).notNull(),
  //   )
  //   .execute();
  await db.schema
    .alterTable('dwDocketEntry')
    .addColumn('originallyFiledDocketNumber', 'varchar')
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
}
