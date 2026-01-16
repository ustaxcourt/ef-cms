import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwUser')
    .addColumn('lat', 'decimal')
    .addColumn('lng', 'decimal')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwUser')
    .dropColumn('lat')
    .dropColumn('lng')
    .execute();
}
