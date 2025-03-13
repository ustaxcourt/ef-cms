import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwStatisticPenalty')
    .addColumn('penaltyNumber', 'smallint')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwStatisticPenalty')
    .dropColumn('penaltyNumber')
    .execute();
}
