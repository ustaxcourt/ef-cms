import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .dropColumn('highPriority')
    .dropColumn('highPriorityReason')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwCase')
    .addColumn('highPriority', 'boolean')
    .addColumn('highPriorityReason', 'varchar')
    .execute();
}
