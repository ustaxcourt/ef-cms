import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwWorkItem')
    .addColumn('workItemId', 'varchar', col => col.primaryKey())
    .addColumn('assigneeId', 'varchar')
    .addColumn('assigneeName', 'varchar')
    .addColumn('associatedJudge', 'varchar', col => col.notNull())
    .addColumn('associatedJudgeId', 'varchar')
    .addColumn('caseIsInProgress', 'boolean')
    .addColumn('completedAt', 'timestamptz')
    .addColumn('completedBy', 'varchar')
    .addColumn('completedByUserId', 'varchar')
    .addColumn('completedMessage', 'varchar')
    .addColumn('createdAt', 'timestamptz', col => col.notNull())
    .addColumn('docketEntry', 'jsonb', col => col.notNull())
    .addColumn('docketNumber', 'varchar', col => col.notNull())
    .addColumn('hideFromPendingMessages', 'boolean')
    .addColumn('highPriority', 'boolean')
    .addColumn('inProgress', 'boolean')
    .addColumn('isInitializeCase', 'boolean')
    .addColumn('isRead', 'boolean')
    .addColumn('section', 'varchar', col => col.notNull())
    .addColumn('sentBy', 'varchar', col => col.notNull())
    .addColumn('sentBySection', 'varchar')
    .addColumn('sentByUserId', 'varchar')
    .addColumn('updatedAt', 'timestamptz', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwWorkItem').execute();
}
