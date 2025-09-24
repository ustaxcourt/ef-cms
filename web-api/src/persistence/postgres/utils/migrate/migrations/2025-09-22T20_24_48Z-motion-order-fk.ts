import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwDocketEntry')
    .addColumn('orderDocketEntityId', 'varchar')
    .addColumn('motionDisposition', 'varchar')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwDocketEntry')
    .dropColumn('orderDocketEntityId')
    .dropColumn('motionDisposition')
    .execute();
}
