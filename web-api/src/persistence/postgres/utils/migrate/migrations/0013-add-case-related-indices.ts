import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex('idxCaseStatus')
    .on('dwCase')
    .column('status')
    .execute();

  await db.schema
    .createIndex('idxCaseCaption')
    .on('dwCase')
    .column('caption')
    .execute();

  await db.schema
    .createIndex('idxCaseReceivedAt')
    .on('dwCase')
    .column('receivedAt')
    .execute();

  await db.schema
    .createIndex('idxCaseIsSealed')
    .on('dwCase')
    .column('isSealed')
    .execute();

  await db.schema
    .createIndex('idxCaseSealedDate')
    .on('dwCase')
    .column('sealedDate')
    .execute();

  await db.schema
    .createIndex('idxCaseAssociatedJudge')
    .on('dwCase')
    .column('associatedJudge')
    .execute();

  await db.schema
    .createIndex('idxCasePreferredTrialCity')
    .on('dwCase')
    .column('preferredTrialCity')
    .execute();

  await db.schema
    .createIndex('idxCaseAutomaticBlocked')
    .on('dwCase')
    .column('automaticBlocked')
    .execute();

  await db.schema
    .createIndex('idxCaseBlocked')
    .on('dwCase')
    .column('blocked')
    .execute();

  await db.schema
    .createIndex('idxCaseCaseType')
    .on('dwCase')
    .column('caseType')
    .execute();

  await db.schema
    .createIndex('idxCaseIsPaper')
    .on('dwCase')
    .column('isPaper')
    .execute();

  await db.schema
    .createIndex('idxCaseProcedureType')
    .on('dwCase')
    .column('procedureType')
    .execute();

  await db.schema
    .createIndex('idxCaseHighPriority')
    .on('dwCase')
    .column('highPriority')
    .execute();

  await db.schema
    .createIndex('idxCaseAssociatedJudgeId')
    .on('dwCase')
    .column('associatedJudgeId')
    .execute();

  await db.schema
    .createIndex('idxCaseClosedDate')
    .on('dwCase')
    .column('closedDate')
    .execute();

  await db.schema
    .createIndex('idxCaseLeadDocketNumber')
    .on('dwCase')
    .column('leadDocketNumber')
    .execute();

  await db.schema
    .createIndex('idxDocketEntryDocketNumber')
    .on('dwDocketEntry')
    .column('docketNumber')
    .execute();

  await db.schema
    .createIndex('idxDocketEntryPending')
    .on('dwDocketEntry')
    .column('pending')
    .execute();

  await db.schema
    .createIndex('idxDocketEntryServedAt')
    .on('dwDocketEntry')
    .column('servedAt')
    .execute();

  await db.schema
    .createIndex('idxDocketEntryIsLegacyServed')
    .on('dwDocketEntry')
    .column('isLegacyServed')
    .execute();

  await db.schema
    .createIndex('idxDocketEntryEventCode')
    .on('dwDocketEntry')
    .column('eventCode')
    .execute();

  await db.schema
    .createIndex('idxDocketEntryFilingDate')
    .on('dwDocketEntry')
    .column('filingDate')
    .execute();

  await db.schema
    .createIndex('idxDocketEntryIsStricken')
    .on('dwDocketEntry')
    .column('isStricken')
    .execute();

  await db.schema
    .createIndex('idxDocketEntryCreatedAt')
    .on('dwDocketEntry')
    .column('createdAt')
    .execute();

  await db.schema
    .createIndex('idxCaseStatusUpdateDocketNumber')
    .on('dwCaseStatusUpdate')
    .column('docketNumber')
    .execute();

  await db.schema
    .createIndex('idxCaseStatusUpdateDate')
    .on('dwCaseStatusUpdate')
    .column('date')
    .execute();

  await db.schema
    .createIndex('idxPetitionerOnCaseDocketNumber')
    .on('dwPetitionerOnCase')
    .column('docketNumber')
    .execute();

  await db.schema
    .createIndex('idxPetitionerOnCaseContactId')
    .on('dwPetitionerOnCase')
    .column('contactId')
    .execute();

  await db.schema
    .createIndex('idxPetitionerOnCaseName')
    .on('dwPetitionerOnCase')
    .column('name')
    .execute();

  await db.schema
    .createIndex('idxPetitionerOnCaseCountryType')
    .on('dwPetitionerOnCase')
    .column('countryType')
    .execute();

  await db.schema
    .createIndex('idxPetitionerOnCasePetitionerState')
    .on('dwPetitionerOnCase')
    .column('state')
    .execute();

  await db.schema
    .createIndex('idxPetitionerOnCaseEmail')
    .on('dwPetitionerOnCase')
    .column('email')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes in reverse order to ensure clean rollback
  await db.schema.dropIndex('idxPetitionerOnCaseEmail').execute();
  await db.schema.dropIndex('idxPetitionerOnCasePetitionerState').execute();
  await db.schema.dropIndex('idxPetitionerOnCaseCountryType').execute();
  await db.schema.dropIndex('idxPetitionerOnCaseName').execute();
  await db.schema.dropIndex('idxPetitionerOnCaseContactId').execute();
  await db.schema.dropIndex('idxPetitionerOnCaseDocketNumber').execute();
  await db.schema.dropIndex('idxCaseStatusUpdateDate').execute();
  await db.schema.dropIndex('idxCaseStatusUpdateDocketNumber').execute();
  await db.schema.dropIndex('idxDocketEntryCreatedAt').execute();
  await db.schema.dropIndex('idxDocketEntryIsStricken').execute();
  await db.schema.dropIndex('idxDocketEntryFilingDate').execute();
  await db.schema.dropIndex('idxDocketEntryEventCode').execute();
  await db.schema.dropIndex('idxDocketEntryIsLegacyServed').execute();
  await db.schema.dropIndex('idxDocketEntryServedAt').execute();
  await db.schema.dropIndex('idxDocketEntryPending').execute();
  await db.schema.dropIndex('idxDocketEntryDocketNumber').execute();
  await db.schema.dropIndex('idxCaseLeadDocketNumber').execute();
  await db.schema.dropIndex('idxCaseClosedDate').execute();
  await db.schema.dropIndex('idxCaseAssociatedJudgeId').execute();
  await db.schema.dropIndex('idxCaseHighPriority').execute();
  await db.schema.dropIndex('idxCaseProcedureType').execute();
  await db.schema.dropIndex('idxCaseIsPaper').execute();
  await db.schema.dropIndex('idxCaseCaseType').execute();
  await db.schema.dropIndex('idxCaseBlocked').execute();
  await db.schema.dropIndex('idxCaseAutomaticBlocked').execute();
  await db.schema.dropIndex('idxCasePreferredTrialCity').execute();
  await db.schema.dropIndex('idxCaseAssociatedJudge').execute();
  await db.schema.dropIndex('idxCaseSealedDate').execute();
  await db.schema.dropIndex('idxCaseIsSealed').execute();
  await db.schema.dropIndex('idxCaseReceivedAt').execute();
  await db.schema.dropIndex('idxCaseCaption').execute();
  await db.schema.dropIndex('idxCaseStatus').execute();
}
