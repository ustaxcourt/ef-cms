import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('dwWorkItem').dropColumn('docketEntry').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwWorkItem')
    .addColumn('docketEntry', 'jsonb', col => col.notNull().defaultTo({}))
    .execute();
  // TODO: add script to paginate over relevant docket entries and jsonify them into dwWorkItem docketEntry
}
