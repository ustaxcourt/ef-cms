import {
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  UNSERVABLE_EVENT_CODES,
} from '../../entities/EntityConstants';
import { Case } from '../../entities/cases/Case';
import { DocketEntry } from '../../entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { createISODateString } from '../../utilities/DateHandler';
import { getDocumentTitleWithAdditionalInfo } from '../../utilities/getDocumentTitleWithAdditionalInfo';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketEntryMeta the docket entry metadata
 * @param {object} providers.docketNumber the docket number of the case to be updated
 * @returns {object} the updated case after the documents are added
 */
export const updateDocketEntryMeta = async (
  applicationContext: IApplicationContext,
  {
    docketEntryMeta,
    docketNumber,
  }: { docketEntryMeta: any; docketNumber: string },
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

  const originalDocketEntry: RawDocketEntry = caseEntity.getDocketEntryById({
    docketEntryId: docketEntryMeta.docketEntryId,
  });

  if (!originalDocketEntry) {
    throw new Error(
      `Docket entry with id ${docketEntryMeta.docketEntryId} not found.`,
    );
  }

  if (
    !DocketEntry.isServed(originalDocketEntry) &&
    !UNSERVABLE_EVENT_CODES.includes(originalDocketEntry.eventCode) &&
    !originalDocketEntry.isMinuteEntry
  ) {
    throw new Error('Unable to update unserved docket entry.');
  }

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
    filedBy: docketEntryMeta.filedBy,
    filers: docketEntryMeta.filers,
    filingDate: docketEntryMeta.filingDate,
    freeText: docketEntryMeta.freeText,
    freeText2: docketEntryMeta.freeText2,
    hasOtherFilingParty: docketEntryMeta.hasOtherFilingParty,
    judge: docketEntryMeta.judge,
    lodged: docketEntryMeta.lodged,
    objections: docketEntryMeta.objections,
    ordinalValue: docketEntryMeta.ordinalValue,
    otherFilingParty: docketEntryMeta.otherFilingParty,
    otherIteration: docketEntryMeta.otherIteration,
    partyIrsPractitioner: docketEntryMeta.partyIrsPractitioner,
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

  const servedAtUpdated =
    editableFields.servedAt &&
    editableFields.servedAt !== originalDocketEntry.servedAt;
  const filingDateUpdated: boolean =
    editableFields.filingDate &&
    editableFields.filingDate !== originalDocketEntry.filingDate;

  const entryRequiresCoverSheet =
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET.includes(
      editableFields.eventCode,
    );
  const originalEntryRequiresCoversheet =
    COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET.includes(
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
    },
    { applicationContext, petitioners: caseEntity.petitioners },
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
    const { numberOfPages } = await applicationContext
      .getUseCaseHelpers()
      .removeCoversheet(applicationContext, {
        docketEntryId: originalDocketEntry.docketEntryId,
      });

    docketEntryEntity.setNumberOfPages(numberOfPages);

    caseEntity.updateDocketEntry(docketEntryEntity);
  }

  const result = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(result, { applicationContext }).validate().toRawObject();
};

export const shouldGenerateCoversheetForDocketEntry = ({
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

export const updateDocketEntryMetaInteractor = withLocking(
  updateDocketEntryMeta,
  (_applicationContext: IApplicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
