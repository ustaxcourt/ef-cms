import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwPetitionerOnCase').execute();
  await db.schema.dropTable('dwCaseStatistic').execute();
  await db.schema.dropTable('dwStatisticPenalty').execute();
}

export function down(_: Kysely<any>): void {
  console.error('Cannot re-add discarded tables');
}
