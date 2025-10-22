import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // TODO
  await db.schema
    .alterTable('dwDocketEntry')
    .addColumn('isFiledAcrossAllCases', 'boolean', col =>
      col.defaultTo(false).notNull(),
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // TODO
  await db.schema
    .alterTable('dwDocketEntry')
    .dropColumn('isFiledAcrossAllCases')
    .execute();
}
