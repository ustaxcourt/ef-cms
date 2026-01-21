import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwDocketEntry')
    .addColumn('documentStorageId', 'varchar')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwDocketEntry')
    .dropColumn('documentStorageId')
    .execute();
}
