import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('dwDocketEntry').dropColumn('documentTypeUpdated');
}

export async function down(db: Kysely<any>): Promise<void> {
  // no point in running this, the data is gone now
  await db.schema
    .alterTable('dwDocketEntry')
    .addColumn('documentTypeUpdated', 'varchar');
}
