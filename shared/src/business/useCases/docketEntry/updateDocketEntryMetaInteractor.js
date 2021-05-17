const {
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
} = require('../../entities/EntityConstants');
const {
  getDocumentTitleWithAdditionalInfo,
} = require('../../utilities/getDocumentTitleWithAdditionalInfo');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { createISODateString } = require('../../utilities/DateHandler');
const { DocketEntry } = require('../../entities/DocketEntry');
const { NotFoundError } = require('../../../errors/errors');
const { UnauthorizedError } = require('../../../errors/errors');

const shouldGenerateCoversheetForDocketEntry = ({
  certificateOfServiceUpdated,
  documentTitleUpdated,
  entryRequiresCoverSheet,
  filingDateUpdated,
  originalDocketEntry,
  servedAtUpdated,
  shouldAddNewCoverSheet,
}) => {
  return (
    (servedAtUpdated ||
      filingDateUpdated ||
      certificateOfServiceUpdated ||
      shouldAddNewCoverSheet ||
      documentTitleUpdated) &&
    (!originalDocketEntry.isCourtIssued() || entryRequiresCoverSheet) &&
    !originalDocketEntry.isMinuteEntry
  );
};

exports.shouldGenerateCoversheetForDocketEntry = shouldGenerateCoversheetForDocketEntry;
/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketNumber the docket number of the case to be updated
 * @param {object} providers.docketEntryMeta the docket entry metadata
 * @returns {object} the updated case after the documents are added
 */
exports.updateDocketEntryMetaInteractor = async (
  applicationContext,
  { docketEntryMeta, docketNumber },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized to update docket entry');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  let caseEntity = new Case(caseToUpdate, { applicationContext });

  const originalDocketEntry = caseEntity.getDocketEntryById({
    docketEntryId: docketEntryMeta.docketEntryId,
  });

  const editableFields = {
    action: docketEntryMeta.action,
    addToCoversheet: docketEntryMeta.addToCoversheet,
    additionalInfo: docketEntryMeta.additionalInfo,
    additionalInfo2: docketEntryMeta.additionalInfo2,
    attachments: docketEntryMeta.attachments,
    certificateOfService: docketEntryMeta.certificateOfService,
    certificateOfServiceDate: docketEntryMeta.certificateOfServiceDate,
    date: docketEntryMeta.date,
    docketNumbers: docketEntryMeta.docketNumbers,
    documentTitle: docketEntryMeta.documentTitle,
    documentType: docketEntryMeta.documentType,
    eventCode: docketEntryMeta.eventCode,
    filingDate: docketEntryMeta.filingDate,
    freeText: docketEntryMeta.freeText,
    freeText2: docketEntryMeta.freeText2,
    hasOtherFilingParty: docketEntryMeta.hasOtherFilingParty,
    judge: docketEntryMeta.judge,
    lodged: docketEntryMeta.lodged,
    objections: docketEntryMeta.objections,
    ordinalValue: docketEntryMeta.ordinalValue,
    otherFilingParty: docketEntryMeta.otherFilingParty,
    partyIrsPractitioner: docketEntryMeta.partyIrsPractitioner,
    partyPrimary: docketEntryMeta.partyPrimary,
    partySecondary: docketEntryMeta.partySecondary,
    pending: docketEntryMeta.pending,
    previousDocument: docketEntryMeta.previousDocument,
    scenario: docketEntryMeta.scenario,
    secondaryDocument: docketEntryMeta.secondaryDocument,
    servedAt:
      docketEntryMeta.servedAt && createISODateString(docketEntryMeta.servedAt),
    servedPartiesCode: docketEntryMeta.servedPartiesCode,
    serviceDate: docketEntryMeta.serviceDate,
    trialLocation: docketEntryMeta.trialLocation,
  };

  if (!originalDocketEntry) {
    throw new Error(
      `Docket entry with id ${docketEntryMeta.docketEntryId} not found.`,
    );
  }

  const servedAtUpdated =
    editableFields.servedAt &&
    editableFields.servedAt !== originalDocketEntry.servedAt;
  const filingDateUpdated =
    editableFields.filingDate &&
    editableFields.filingDate !== originalDocketEntry.filingDate;

  const entryRequiresCoverSheet = COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET.includes(
    editableFields.eventCode,
  );
  const originalEntryRequiresCoversheet = COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET.includes(
    originalDocketEntry.eventCode,
  );
  const shouldAddNewCoverSheet =
    !originalEntryRequiresCoversheet && entryRequiresCoverSheet;

  const shouldRemoveExistingCoverSheet =
    originalEntryRequiresCoversheet && !entryRequiresCoverSheet;

  const documentTitleUpdated =
    getDocumentTitleWithAdditionalInfo({ docketEntry: originalDocketEntry }) !==
    getDocumentTitleWithAdditionalInfo({ docketEntry: docketEntryMeta });

  const certificateOfServiceUpdated =
    originalDocketEntry.certificateOfService !==
    docketEntryMeta.certificateOfService;

  const shouldGenerateCoversheet = shouldGenerateCoversheetForDocketEntry({
    certificateOfServiceUpdated,
    documentTitleUpdated,
    entryRequiresCoverSheet,
    filingDateUpdated,
    originalDocketEntry,
    servedAtUpdated,
    shouldAddNewCoverSheet,
  });

  const docketEntryEntity = new DocketEntry(
    {
      ...originalDocketEntry,
      ...editableFields,
      // allow constructor to re-generate
      contactPrimary: caseEntity.getContactPrimary(),
      contactSecondary: caseEntity.getContactSecondary(),
      filedBy: undefined,
    },
    { applicationContext },
  ).validate();

  caseEntity.updateDocketEntry(docketEntryEntity);

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({ applicationContext, caseEntity });

  if (shouldGenerateCoversheet) {
    await applicationContext.getPersistenceGateway().updateDocketEntry({
      applicationContext,
      docketEntryId: docketEntryEntity.docketEntryId,
      docketNumber,
      document: docketEntryEntity.validate(),
    });

    const updatedDocketEntry = await applicationContext
      .getUseCases()
      .addCoversheetInteractor(applicationContext, {
        docketEntryId: originalDocketEntry.docketEntryId,
        docketNumber: caseEntity.docketNumber,
        filingDateUpdated,
      });

    caseEntity.updateDocketEntry(updatedDocketEntry);
  } else if (shouldRemoveExistingCoverSheet) {
    await applicationContext.getPersistenceGateway().updateDocketEntry({
      applicationContext,
      docketEntryId: docketEntryEntity.docketEntryId,
      docketNumber,
      document: docketEntryEntity.validate(),
    });
    const updatedDocketEntry = await applicationContext
      .getUseCaseHelpers()
      .removeCoversheet(applicationContext, {
        docketEntryId: originalDocketEntry.docketEntryId,
        docketNumber: caseEntity.docketNumber,
        filingDateUpdated,
      });
    caseEntity.updateDocketEntry(updatedDocketEntry);
  }

  const result = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(result, { applicationContext }).validate().toRawObject();
};
