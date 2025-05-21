import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .addColumn(
      'manuallyAddedToTrial',
      'boolean',
      col => col.defaultTo(false), // ideally undefined
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .dropColumn('manuallyAddedToTrial')
    .execute();
}
