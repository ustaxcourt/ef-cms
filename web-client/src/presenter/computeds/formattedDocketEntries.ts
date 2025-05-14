import { ClientApplicationContext } from '@web-client/applicationContext';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { Get } from 'cerebral';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { computeIsNotServedDocument } from '@shared/business/utilities/getFormattedCaseDetail';
import { sortBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const isSelectableForDownload = (entry: RawDocketEntry) => {
  return (
    !DocketEntry.isMinuteEntry(entry) &&
    entry.isFileAttached &&
    entry.isOnDocketRecord
  );
};

export const setupIconsToDisplay = ({ formattedResult, isExternalUser }) => {
  const iconsToDisplay: any[] = [];

  if (formattedResult.sealedTo) {
    iconsToDisplay.push({
      className: 'sealed-docket-entry',
      icon: 'lock',
      title: formattedResult.sealedToTooltip,
    });
  }

  if (isExternalUser) {
    return iconsToDisplay;
  } else if (formattedResult.isPaper) {
    iconsToDisplay.push({
      icon: ['fas', 'file-alt'],
      title: 'Is paper',
    });
  } else if (formattedResult.isInProgress) {
    iconsToDisplay.push({
      icon: ['fas', 'thumbtack'],
      title: 'In progress',
    });
  } else if (formattedResult.qcNeeded) {
    iconsToDisplay.push({
      icon: ['fa', 'star'],
      title: 'Is untouched',
    });
  } else if (formattedResult.showLoadingIcon) {
    iconsToDisplay.push({
      className: 'fa-spin spinner',
      icon: ['fa-spin', 'spinner'],
      title: 'Is loading',
    });
  }

  return iconsToDisplay;
};

export const getShowEditDocketRecordEntry = ({
  applicationContext,
  entry,
  userPermissions,
}) => {
  const { SYSTEM_GENERATED_DOCUMENT_TYPES, UNSERVABLE_EVENT_CODES } =
    applicationContext.getConstants();

  const systemGeneratedEventCodes = Object.keys(
    SYSTEM_GENERATED_DOCUMENT_TYPES,
  ).map(key => {
    return SYSTEM_GENERATED_DOCUMENT_TYPES[key].eventCode;
  });

  const hasSystemGeneratedDocument =
    entry && systemGeneratedEventCodes.includes(entry.eventCode);
  const hasCourtIssuedDocument = entry && entry.isCourtIssuedDocument;
  const hasServedCourtIssuedDocument =
    hasCourtIssuedDocument && DocketEntry.isServed(entry);
  const hasUnservableCourtIssuedDocument =
    entry && UNSERVABLE_EVENT_CODES.includes(entry.eventCode);

  return (
    userPermissions.EDIT_DOCKET_ENTRY &&
    (hasSystemGeneratedDocument ||
      DocketEntry.isMinuteEntry(entry) ||
      entry.qcWorkItemsCompleted) &&
    (!hasCourtIssuedDocument ||
      hasServedCourtIssuedDocument ||
      hasUnservableCourtIssuedDocument)
  );
};

export const getShowSealDocketRecordEntry = ({ applicationContext, entry }) => {
  const allOpinionEventCodes =
    applicationContext.getConstants().OPINION_EVENT_CODES_WITH_BENCH_OPINION;

  const docketEntryIsOpinion = allOpinionEventCodes.includes(entry.eventCode);

  return !docketEntryIsOpinion;
};

export const getFormattedDocketEntry = ({
  applicationContext,
  docketNumber,
  entry,
  permissions,
  rawCase,
  user,
  visibilityPolicyDateFormatted,
}) => {
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);

  const { DOCKET_ENTRY_SEALED_TO_TYPES, DOCUMENT_PROCESSING_STATUS_OPTIONS } =
    applicationContext.getConstants();

  const formattedResult = {
    numberOfPages: 0,
    ...entry,
    createdAtFormatted: entry.createdAtFormatted,
  };

  if (!isExternalUser) {
    formattedResult.showLoadingIcon =
      !permissions.UPDATE_CASE &&
      entry.processingStatus !== DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;
  }

  formattedResult.isPaper =
    !formattedResult.isInProgress &&
    !formattedResult.qcWorkItemsUntouched &&
    entry.isPaper;

  if (entry.isSealed) {
    formattedResult.sealedToTooltip = applicationContext
      .getUtilities()
      .getSealedDocketEntryTooltip(applicationContext, entry);
  }

  if (entry.documentTitle) {
    formattedResult.descriptionDisplay = applicationContext
      .getUtilities()
      .getDescriptionDisplay(entry);
  }

  formattedResult.showDocumentProcessing =
    !permissions.UPDATE_CASE &&
    entry.processingStatus !== DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;

  formattedResult.showNotServed = computeIsNotServedDocument({
    formattedEntry: entry,
  });
  formattedResult.showServed = entry.isStatusServed;

  const showDocumentLinks = DocketEntry.isDownloadable(entry, {
    isTerminalUser: false,
    rawCase,
    user,
    visibilityChangeDate: visibilityPolicyDateFormatted,
  });

  formattedResult.showDocumentViewerLink = !isExternalUser && showDocumentLinks;

  formattedResult.showLinkToDocument = isExternalUser && showDocumentLinks;

  formattedResult.showEditDocketRecordEntry = getShowEditDocketRecordEntry({
    applicationContext,
    entry,
    userPermissions: permissions,
  });

  formattedResult.showSealDocketRecordEntry = getShowSealDocketRecordEntry({
    applicationContext,
    entry,
  });

  formattedResult.showDocumentDescriptionWithoutLink =
    !showDocumentLinks && !formattedResult.showDocumentProcessing;

  formattedResult.editDocketEntryMetaLink = `/case-detail/${docketNumber}/docket-entry/${formattedResult.index}/edit-meta`;

  formattedResult.iconsToDisplay = setupIconsToDisplay({
    formattedResult,
    isExternalUser,
  });

  formattedResult.sealButtonText = formattedResult.isSealed ? 'Unseal' : 'Seal';
  formattedResult.sealIcon = formattedResult.isSealed ? 'unlock' : 'lock';
  formattedResult.sealButtonTooltip = formattedResult.isSealed
    ? formattedResult.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL
      ? 'Unseal to the public and parties of this case'
      : 'Unseal to the public'
    : 'Seal to the public';
  formattedResult.toolTipText = !formattedResult.isFileAttached
    ? 'No Document View'
    : undefined;

  return formattedResult;
};

export const formattedDocketEntries = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const user = get(state.user);
  const permissions = get(state.permissions);
  const { docketRecordFilter } = get(state.sessionMetadata);
  const { ALLOWLIST_FEATURE_FLAGS_POSTGRES } =
    applicationContext.getConstants();
  const caseDetail = get(state.caseDetail);
  const { docketNumber } = caseDetail;
  let docketRecordSort;
  const { formatCase } = applicationContext.getUtilities();
  if (docketNumber) {
    docketRecordSort = get(
      state.sessionMetadata.docketRecordSort[docketNumber],
    );
  }

  const docketRecordSortField = get(
    state[STATE_KEYS.DOCKET_RECORD_TABLE_SORT].sortField,
  );
  const docketRecordSortOrder = get(
    state[STATE_KEYS.DOCKET_RECORD_TABLE_SORT].sortOrder,
  );

  const DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS_POSTGRES.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE
        .key
    ],
  );
  const visibilityPolicyDateFormatted = applicationContext
    .getUtilities()
    .prepareDateFromString(DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE)
    .toISO();
  const result = formatCase(applicationContext, caseDetail, user);
  const documentsSelectedForDownload = get(state.documentsSelectedForDownload);

  result.formattedDocketEntries = applicationContext
    .getUtilities()
    .getDocketEntriesByFilter(applicationContext, {
      docketEntries: result.formattedDocketEntries,
      docketRecordFilter,
    });

  let docketEntriesFormatted = result.formattedDocketEntries
    .map(entry =>
      getFormattedDocketEntry({
        applicationContext,
        docketNumber,
        entry,
        permissions,
        rawCase: caseDetail,
        user,
        visibilityPolicyDateFormatted,
      }),
    )
    .map(docketEntry => {
      return {
        ...docketEntry,
        isDocumentSelected: documentsSelectedForDownload.some(
          docEntry => docEntry.docketEntryId === docketEntry.docketEntryId,
        ),
        isSelectableForDownload: isSelectableForDownload(docketEntry),
      };
    });

  docketEntriesFormatted = sortDocketEntryTable(
    docketEntriesFormatted,
    docketRecordSortField,
    docketRecordSortOrder,
  );

  const selectableDocumentsCount = docketEntriesFormatted.filter(entry =>
    isSelectableForDownload(entry),
  ).length;
  const documentsSelectedForDownloadCount = docketEntriesFormatted.filter(
    entry => entry.isDocumentSelected && isSelectableForDownload(entry),
  ).length;

  const allDocumentsSelected =
    documentsSelectedForDownloadCount === selectableDocumentsCount &&
    selectableDocumentsCount !== 0;

  const someDocumentsSelectedForDownload =
    documentsSelectedForDownloadCount > 0 &&
    documentsSelectedForDownloadCount < selectableDocumentsCount;

  result.someDocumentsSelectedForDownload = someDocumentsSelectedForDownload;

  result.isDownloadLinkEnabled =
    someDocumentsSelectedForDownload || allDocumentsSelected;
  result.allDocumentsSelectedForDownload = allDocumentsSelected || false;

  result.formattedDocketEntriesOnDocketRecord = docketEntriesFormatted.filter(
    d => d.isOnDocketRecord,
  );

  result.allEligibleDocumentsForDownload = docketEntriesFormatted
    .filter(docEntry => isSelectableForDownload(docEntry))
    .map(docEntry => ({
      docketEntryId: docEntry.docketEntryId,
    }));

  result.formattedPendingDocketEntriesOnDocketRecord =
    result.formattedDocketEntriesOnDocketRecord.filter(docketEntry =>
      applicationContext.getUtilities().isPending(docketEntry),
    );

  result.formattedDraftDocuments = result.draftDocuments.map(draftDocument => {
    return {
      ...draftDocument,
      descriptionDisplay: draftDocument.documentTitle,
      showDocumentViewerLink: permissions.UPDATE_CASE,
    };
  });

  result.docketRecordSort = docketRecordSort;
  return result;
};

export function sortDocketEntryTable<T>(
  docketEntries: (T & { sortingFilingDate: string | undefined })[] = [],
  docketRecordSortField: string | undefined,
  docketRecordSortOrder: 'asc' | 'desc' | undefined,
): T[] {
  if (!docketRecordSortField || !docketRecordSortOrder) {
    return sortBy(docketEntries, ['sortingFilingDate', 'index']);
  }

  const sortedDocketEntries = sortBy(docketEntries, [
    docketRecordSortField,
    'index',
  ]);

  if (docketRecordSortOrder === 'desc') {
    return sortedDocketEntries.reverse().sort(sortUndefined);
  }

  return sortedDocketEntries.sort(sortUndefined);
}

function sortUndefined(
  a: { sortingFilingDate: string | undefined },
  b: { sortingFilingDate: string | undefined },
): number {
  if (a.sortingFilingDate && !b.sortingFilingDate) return -1;
  if (!a.sortingFilingDate && b.sortingFilingDate) return 1;
  return 0;
}
