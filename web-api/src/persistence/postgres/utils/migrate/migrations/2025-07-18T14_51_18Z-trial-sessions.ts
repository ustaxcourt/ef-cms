import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('dwTrialSession')
    .addColumn('trialSessionId', 'uuid', col => col.primaryKey())
    .addColumn('address1', 'varchar')
    .addColumn('address2', 'varchar')
    .addColumn('alternateTrialClerkName', 'varchar')
    .addColumn('chambersPhoneNumber', 'varchar')
    .addColumn('city', 'varchar')
    .addColumn('courthouseName', 'varchar')
    .addColumn('courtReporter', 'varchar')
    .addColumn('createdAt', 'timestamptz')
    .addColumn('dismissedAlertForNott', 'boolean')
    .addColumn('hasNottBeenServed', 'boolean')
    .addColumn('estimatedEndDate', 'timestamptz')
    .addColumn('irsCalendarAdministrator', 'varchar')
    .addColumn('irsCalendarAdministratorInfoEmail', 'varchar')
    .addColumn('irsCalendarAdministratorInfoPhone', 'varchar')
    .addColumn('irsCalendarAdministratorInfoName', 'varchar')
    .addColumn('isCalendared', 'boolean')
    .addColumn('joinPhoneNumber', 'varchar')
    .addColumn('judgeName', 'varchar')
    .addColumn('judgeUserId', 'varchar')
    .addColumn('maxCases', 'integer')
    .addColumn('meetingId', 'varchar')
    .addColumn('notes', 'varchar')
    .addColumn('noticeIssuedDate', 'timestamptz')
    .addColumn('password', 'varchar')
    .addColumn('postalCode', 'varchar')
    .addColumn('proceedingType', 'varchar')
    .addColumn('sessionScope', 'varchar')
    .addColumn('sessionStatus', 'varchar')
    .addColumn('sessionType', 'varchar')
    .addColumn('startDate', 'timestamptz')
    .addColumn('startTime', 'varchar')
    .addColumn('state', 'varchar')
    .addColumn('swingSession', 'boolean')
    .addColumn('swingSessionId', 'varchar')
    .addColumn('term', 'varchar')
    .addColumn('termYear', 'varchar')
    .addColumn('trialClerkName', 'varchar')
    .addColumn('trialClerkUserId', 'varchar')
    .addColumn('trialLocation', 'varchar')
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

  await db.schema
    .createTable('dwTrialSessionNotificationProcessing')
    .addColumn('trialSessionId', 'uuid', col => col.primaryKey())
    .addColumn('caseStatuses', 'jsonb')
    .addColumn('status', 'varchar')
    .addColumn('unfinishedCases', 'integer')
    .execute();

  await db.schema
    .createTable('dwTrialSessionCase')
    .addColumn('docketNumber', 'varchar', col => col.notNull())
    .addColumn('trialSessionId', 'uuid', col => col.notNull())
    .addColumn('addedToSessionAt', 'timestamptz')
    .addColumn('calendarNotes', 'varchar')
    .addColumn('disposition', 'varchar')
    .addColumn('isManuallyAdded', 'boolean', col =>
      col.notNull().defaultTo(false),
    )
    .addColumn('removedFromTrial', 'boolean', col =>
      col.notNull().defaultTo(false),
    )
    .addColumn('removedFromTrialDate', 'timestamptz')
    .addColumn('isHearing', 'boolean', col => col.notNull().defaultTo(false))
    .addPrimaryKeyConstraint('dwTrialSessionCasePk', [
      'docketNumber',
      'trialSessionId',
    ])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('dwTrialSession').execute();

  await db.schema.dropTable('dwTrialSessionWorkingCopy').execute();

  await db.schema.dropTable('dwTrialSessionPaperPdf').execute();

  await db.schema.dropTable('dwTrialSessionNoticeProcessing').execute();

  await db.schema.dropTable('dwTrialSessionCase').execute();
}
