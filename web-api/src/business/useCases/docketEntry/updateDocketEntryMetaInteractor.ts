import {
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  UNSERVABLE_EVENT_CODES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createISODateString } from '../../../../../shared/src/business/utilities/DateHandler';
import { getDocumentTitleWithAdditionalInfo } from '../../../../../shared/src/business/utilities/getDocumentTitleWithAdditionalInfo';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

export const updateDocketEntryMeta = async (
  applicationContext: ServerApplicationContext,
  {
    docketEntryMeta,
    docketNumber,
  }: { docketEntryMeta: any; docketNumber: string },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.EDIT_DOCKET_ENTRY)) {
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

  let caseEntity = new Case(caseToUpdate, { authorizedUser });

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
    !DocketEntry.isMinuteEntry(originalDocketEntry)
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
    { authorizedUser, petitioners: caseEntity.petitioners },
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
      .addCoversheetInteractor(
        applicationContext,
        {
          docketEntryId: originalDocketEntry.docketEntryId,
          docketNumber: caseEntity.docketNumber,
          filingDateUpdated,
        },
        authorizedUser,
      );

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
      authorizedUser,
      caseToUpdate: caseEntity,
    });

  return new Case(result, { authorizedUser }).validate().toRawObject();
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
    !DocketEntry.isMinuteEntry(originalDocketEntry)
  );
};

export const updateDocketEntryMetaInteractor = withLocking(
  updateDocketEntryMeta,
  (_applicationContext: ServerApplicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
