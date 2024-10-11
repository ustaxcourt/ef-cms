import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwCaseCorrespondence')
    .addColumn('correspondenceId', 'varchar', col => col.primaryKey())
    .addColumn('documentTitle', 'varchar', col => col.notNull())
    .addColumn('filedBy', 'varchar')
    .addColumn('userId', 'varchar', col => col.notNull())
    .addColumn('archived', 'boolean')
    .addColumn('filingDate', 'timestamptz', col => col.notNull())
    .execute();

  await db.schema
    .createTable('dwCaseDeadline')
    .addColumn('caseDeadlineId', 'varchar', col => col.primaryKey())
    .addColumn('description', 'varchar', col => col.notNull())
    .addColumn('docketNumber', 'varchar', col => col.notNull())
    .addColumn('sortableDocketNumber', 'int8', col => col.notNull())
    .addColumn('associatedJudge', 'varchar', col => col.notNull())
    .addColumn('associatedJudgeId', 'varchar')
    .addColumn('createdAt', 'timestamptz', col => col.notNull())
    .addColumn('deadlineDate', 'timestamptz', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwCaseCorrespondence').execute();
  await db.schema.dropTable('dwCaseDeadline').execute();
}
