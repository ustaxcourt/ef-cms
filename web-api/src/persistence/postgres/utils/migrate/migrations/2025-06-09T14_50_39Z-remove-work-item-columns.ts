import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwWorkItem')
    .dropColumn('associatedJudge')
    .dropColumn('associatedJudgeId')
    .dropColumn('caseIsInProgress')
    .dropColumn('hideFromPendingMessages')
    .dropColumn('highPriority')
    .dropColumn('isInitializeCase')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('dwWorkItem')
    .addColumn('associatedJudge', 'varchar')
    .addColumn('associatedJudgeId', 'varchar')
    .addColumn('caseIsInProgress', 'boolean')
    .addColumn('hideFromPendingMessages', 'boolean')
    .addColumn('highPriority', 'boolean')
    .addColumn('isInitializeCase', 'boolean')
    .execute();
}
