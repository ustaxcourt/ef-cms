import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwTrialSession')
    .addColumn('trialSessionId', 'uuid', col => col.primaryKey())
    .addColumn('address1', 'varchar')
    .addColumn('address2', 'varchar')
    .addColumn('alternateTrialClerkName', 'varchar')
    .addColumn('caseOrder', 'jsonb')
    .addColumn('chambersPhoneNumber', 'integer')
    .addColumn('city', 'varchar')
    .addColumn('courthouseName', 'varchar')
    .addColumn('courtReporter', 'varchar')
    .addColumn('createdAt', 'date')
    .addColumn('dismissedAlertForNOTT', 'boolean')
    .addColumn('hasNOTTBeenServed', 'boolean')
    .addColumn('estimatedEndDate', 'date')
    .addColumn('irsCalendarAdministrator', 'varchar')
    .addColumn('irsCalendarAdministratorInfo', 'jsonb') //COME BACK
    .addColumn('isCalendared', 'boolean')
    .addColumn('joinPhoneNumber', 'varchar')
    .addColumn('judge', 'jsonb') //COME BACK
    .addColumn('maxCases', 'integer')
    .addColumn('meetingId', 'varchar')
    .addColumn('notes', 'varchar')
    .addColumn('noticeIssuedDate', 'date')
    .addColumn('password', 'varchar')
    .addColumn('postalCode', 'varchar')
    .addColumn('proceedingType', 'varchar')
    .addColumn('sessionScope', 'varchar')
    .addColumn('sessionStatus', 'varchar')
    .addColumn('sessionType', 'varchar')
    .addColumn('startDate', 'date')
    .addColumn('startTime', 'varchar')
    .addColumn('state', 'varchar')
    .addColumn('swingSession', 'boolean')
    .addColumn('swingSessionId', 'varchar')
    .addColumn('term', 'varchar')
    .addColumn('termYear', 'varchar')
    .addColumn('trialClerk', 'jsonb') //come back
    .addColumn('trialLocation', 'varchar')
    .addColumn('paperServicePdfs', 'jsonb')
    .execute();

  await db.schema
    .createTable('dwTrialSessionWorkingCopy')
    .addColumn('trialSessionId', 'uuid')
    .addColumn('userId', 'uuid')
    .addColumn('caseMetadata', 'jsonb')
    .addColumn('filters', 'jsonb')
    .addColumn('sessionNotes', 'varchar')
    .addColumn('sort', 'varchar')
    .addColumn('sortOrder', 'varchar')
    .addPrimaryKeyConstraint('dwTrialSessionWorkingCopyPk', [
      'trialSessionId',
      'userId',
    ])
    .execute();

  await db.schema
    .createTable('dwTrialSessionPaperPdf')
    .addColumn('ttl', 'bigint', col => col.notNull())
    .addColumn('fileId', 'varchar', col => col.notNull())
    .addColumn('title', 'varchar', col => col.notNull())
    .addColumn('trialSessionId', 'uuid', col => col.notNull())
    .addPrimaryKeyConstraint('dwTrialSessionPaperPdfPk', [
      'fileId',
      'trialSessionId',
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwTrialSession').execute();

  await db.schema.dropTable('dwTrialSessionWorkingCopy').execute();
  
  await db.schema.dropTable('dwTrialSessionPaperPdf').execute();
}
