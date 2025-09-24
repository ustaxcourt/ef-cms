import {
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  UNSERVABLE_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getDocumentTitleWithAdditionalInfo } from '@shared/business/utilities/getDocumentTitleWithAdditionalInfo';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

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

  const caseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} was not found.`);
  }

  let caseEntity = new Case(caseToUpdate, { authorizedUser });

  const originalDocketEntry = caseEntity.getDocketEntryById({
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
    .updateCaseAutomaticBlock({ caseEntity });

  if (shouldGenerateCoversheet) {
    await upsertDocketEntries([docketEntryEntity.validate()]);

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

  // If this case is the lead of a consolidated group, propagate editable
  // fields to the member cases' corresponding docket entries so edits made
  // on the lead case are reflected across the consolidated cases.
  const { consolidatedCases } = caseEntity;

  if (consolidatedCases && consolidatedCases.length > 0) {
    // Only a subset of editable fields (Document Info) should be
    // propagated from the lead case to member cases. Service and Action
    // related fields (servedAt, serviceDate, servedPartiesCode, action,
    // etc.) must remain case-specific and should NOT be propagated.
    const DOCUMENT_INFO_FIELDS = [
      'addToCoversheet',
      'additionalInfo',
      'additionalInfo2',
      'attachments',
      'certificateOfService',
      'certificateOfServiceDate',
      'documentTitle',
      'documentType',
      'eventCode',
      'filedBy',
      'filers',
      'filingDate',
      'freeText',
      'hasOtherFilingParty',
      'ordinalValue',
      'otherFilingParty',
      'otherIteration',
      'partyIrsPractitioner',
      'previousDocument',
      'secondaryDocument',
      'trialLocation',
      'docketNumbers',
      'objections',
    ];
    // Build list of docket numbers to update (including the lead)
    const docketNumbersToUpdate = consolidatedCases
      .filter(({ docketNumber }) => docketNumber)
      .map(({ docketNumber }) => docketNumber)
      .concat(caseEntity.docketNumber);

    // Fetch the current case records for those docket numbers
    const casesToUpdate = await getCasesByDocketNumbers({
      docketNumbers: Array.from(new Set(docketNumbersToUpdate)),
    });

    const updatedDocketEntries = casesToUpdate
      .map(caseRecord => {
        const { docketNumber } = caseRecord;
        const consolidatedCaseEntity =
          docketNumber === caseEntity.docketNumber
            ? caseEntity
            : new Case(caseRecord, { authorizedUser });

        const consolidatedCaseDocketEntry =
          consolidatedCaseEntity.getDocketEntryById({
            docketEntryId: docketEntryMeta.docketEntryId,
          });

        if (consolidatedCaseDocketEntry) {
          // Build an object containing only the Document Info fields that
          // should be propagated to member cases. This ensures Service and
          // Action tab changes remain local to the case being edited.
          const propagationFields: any = {};
          DOCUMENT_INFO_FIELDS.forEach(field => {
            if (Object.prototype.hasOwnProperty.call(editableFields, field)) {
              propagationFields[field] = (editableFields as any)[field];
            }
          });

          // Create a DocketEntry entity merging the original member entry
          // with only the allowed propagation fields from the lead update.
          const merged = new DocketEntry(
            {
              ...consolidatedCaseDocketEntry,
              ...propagationFields,
            },
            { authorizedUser, petitioners: consolidatedCaseEntity.petitioners },
          );

          // Maintain processing status/page counts only when appropriate;
          // if the lead case update set numberOfPages or processing status,
          // prefer the lead's values (editableFields may not contain pages).
          // Prefer the lead case's docket entry numberOfPages when present
          if (docketEntryEntity && docketEntryEntity.numberOfPages) {
            merged.setNumberOfPages(docketEntryEntity.numberOfPages);
          }

          return merged.validate().toRawObject();
        }

        return undefined;
      })
      .filter(Boolean);

    if (updatedDocketEntries.length > 0) {
      await upsertDocketEntries(updatedDocketEntries as any[]);
    }
  }

  const result = await updateCaseAndAssociations({
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
