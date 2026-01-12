import { Kysely } from 'kysely';

// We always sort by receivedAt and docketNumber, so we add compound indices based on these and on the Custom Case filter types.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex('idx_customCaseReport_status')
    .on('dwCase')
    .columns(['status', 'receivedAt', 'docketNumber'])
    .execute();
  await db.schema
    .createIndex('idx_customCaseReport_caseType')
    .on('dwCase')
    .columns(['caseType', 'receivedAt', 'docketNumber'])
    .execute();
  await db.schema
    .createIndex('idx_customCaseReport_procedureType')
    .on('dwCase')
    .columns(['procedureType', 'receivedAt', 'docketNumber'])
    .execute();
  await db.schema
    .createIndex('idx_customCaseReport_isPaper')
    .on('dwCase')
    .columns(['isPaper', 'receivedAt', 'docketNumber'])
    .execute();
  await db.schema
    .createIndex('idx_customCaseReport_associatedJudgeId')
    .on('dwCase')
    .columns(['associatedJudgeId', 'receivedAt', 'docketNumber'])
    .execute();
  await db.schema
    .createIndex('idx_customCaseReport_preferredTrialCity')
    .on('dwCase')
    .columns(['preferredTrialCity', 'receivedAt', 'docketNumber'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_customCaseReport_preferredTrialCity')
    .execute();
  await db.schema.dropIndex('idx_customCaseReport_associatedJudgeId').execute();
  await db.schema.dropIndex('idx_customCaseReport_isPaper').execute();
  await db.schema.dropIndex('idx_customCaseReport_procedureType').execute();
  await db.schema.dropIndex('idx_customCaseReport_caseType').execute();
  await db.schema.dropIndex('idx_customCaseReport_status').execute();
}
