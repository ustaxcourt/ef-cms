import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex('idx_caseCorrespondence_docketNumber')
    .on('dwCaseCorrespondence')
    .column('docketNumber')
    .execute();

  await db.schema
    .createIndex('idx_caseDeadline_docketNumber')
    .on('dwCaseDeadline')
    .column('docketNumber')
    .execute();

  await db.schema
    .createIndex('idx_caseDeadline_deadlineDate')
    .on('dwCaseDeadline')
    .column('deadlineDate')
    .execute();

  await db.schema
    .createIndex('idx_caseDeadline_sortableDocketNumber')
    .on('dwCaseDeadline')
    .column('sortableDocketNumber')
    .execute();

  await db.schema
    .createIndex('idx_caseDeadline_associatedJudge')
    .on('dwCaseDeadline')
    .column('associatedJudge')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_caseDeadline_associatedJudge')
    .on('dwCaseDeadline')
    .execute();

  await db.schema
    .dropIndex('idx_caseDeadline_sortableDocketNumber')
    .on('dwCaseDeadline')
    .execute();

  await db.schema
    .dropIndex('idx_caseDeadline_deadlineDate')
    .on('dwCaseDeadline')
    .execute();

  await db.schema
    .dropIndex('idx_caseDeadline_docketNumber')
    .on('dwCaseDeadline')
    .execute();

  await db.schema
    .dropIndex('idx_caseCorrespondence_docketNumber')
    .on('dwCaseCorrespondence')
    .execute();
}
