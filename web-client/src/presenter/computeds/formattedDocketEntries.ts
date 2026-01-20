import { ClientApplicationContext } from '@web-client/applicationContext';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { Get } from 'cerebral';
import {
  ALLOWLIST_FEATURE_FLAGS,
  MOTION_DISPOSITION_VERBIAGE,
  STATE_KEYS,
} from '@shared/business/entities/EntityConstants';
import { computeIsNotServedDocument } from '@shared/business/utilities/getFormattedCaseDetail';
import { concat, sortBy } from 'lodash';
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
      size: 'lg',
    });
  }

  if (isExternalUser) {
    return iconsToDisplay;
  } else if (formattedResult.isPaper) {
    iconsToDisplay.push({
      className: 'fa-icon-blue',
      icon: ['fas', 'file-alt'],
      title: 'Is paper',
      size: 'lg',
    });
  } else if (formattedResult.isInProgress) {
    iconsToDisplay.push({
      className: 'fa-icon-gold',
      icon: ['fas', 'thumbtack'],
      title: 'In progress',
      size: 'lg',
    });
  } else if (formattedResult.qcNeeded) {
    iconsToDisplay.push({
      className: 'fa-icon-red',
      icon: ['fa', 'star'],
      title: 'Is untouched',
      size: 'lg',
    });
  } else if (formattedResult.showLoadingIcon) {
    iconsToDisplay.push({
      className: 'fa-spin spinner',
      icon: ['fa-spin', 'spinner'],
      title: 'Is loading',
      size: 'lg',
    });
  }

  return iconsToDisplay;
};

export const getShowEditDocketRecordEntry = ({
  applicationContext,
  entry,
  get,
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

  const eventCode = entry ? entry.eventCode : null;

  const restrictedEventCodes = get(
    state.featureFlags[ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key],
  );

  const restrictedEventCodesArray =
    typeof restrictedEventCodes === 'string'
      ? restrictedEventCodes.split(',').map(code => code.trim())
      : [];

  const isRestrictedEventCode = restrictedEventCodesArray.includes(eventCode);

  return (
    !isRestrictedEventCode &&
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

const getRelatedDocketEntryDetails = (
  motionEntry: RawDocketEntry,
  rawCase: RawCase,
  targetDocketEntryId: string,
  isExternalUser: boolean,
  user: any,
  visibilityPolicyDateFormatted: any,
) => {
  const relatedOrder = rawCase.docketEntries.find(
    entry => entry.docketEntryId === targetDocketEntryId,
  );

  if (!relatedOrder) {
    throw new Error(
      `Related order not found for motion with id ${motionEntry.docketEntryId} and targetDocketEntryId ${targetDocketEntryId} and title ${
        motionEntry.documentTitle
      }`,
    );
  }

  const isDownloadable = DocketEntry.isDownloadable(relatedOrder, {
    isTerminalUser: false,
    rawCase,
    user,
    visibilityChangeDate: visibilityPolicyDateFormatted,
  });

  const showDocumentViewerLink = isDownloadable && !isExternalUser;
  const showDownloadLink = isDownloadable && isExternalUser;
  return {
    index: relatedOrder.index,
    showDocumentViewerLink,
    showDownloadLink,
  };
};

export const getFormattedDocketEntry = ({
  applicationContext,
  docketNumber,
  entry,
  get,
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

  formattedResult.relatedDocketEntries = [];
  if (entry.affectedByDocketEntries) {
    formattedResult.relatedDocketEntries = concat(
      formattedResult.relatedDocketEntries,
      entry.affectedByDocketEntries.map(affectedEntry => {
        const { index, showDocumentViewerLink, showDownloadLink } =
          getRelatedDocketEntryDetails(
            entry,
            rawCase,
            affectedEntry.docketEntryId,
            isExternalUser,
            user,
            visibilityPolicyDateFormatted,
          );

        return {
          ...affectedEntry,
          docketEntryIndex: index,
          showDocumentViewerLink,
          showDownloadLink,
          disposition:
            MOTION_DISPOSITION_VERBIAGE[affectedEntry.disposition].MOTION,
        };
      }),
    );
  }

  if (entry.affectedDocketEntries) {
    formattedResult.relatedDocketEntries = concat(
      formattedResult.relatedDocketEntries,
      entry.affectedDocketEntries.map(affectedEntry => {
        const { index, showDocumentViewerLink, showDownloadLink } =
          getRelatedDocketEntryDetails(
            entry,
            rawCase,
            affectedEntry.docketEntryId,
            isExternalUser,
            user,
            visibilityPolicyDateFormatted,
          );

        return {
          ...affectedEntry,
          docketEntryIndex: index,
          showDocumentViewerLink,
          showDownloadLink,
          disposition:
            MOTION_DISPOSITION_VERBIAGE[affectedEntry.disposition].ORDER,
        };
      }),
    );
  }

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
    get,
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
  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();
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
      ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key
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
        get,
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
