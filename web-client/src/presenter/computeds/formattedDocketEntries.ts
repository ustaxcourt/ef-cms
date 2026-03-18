import { ClientApplicationContext } from '@web-client/applicationContext';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { Get } from 'cerebral';
import {
  ALLOWLIST_FEATURE_FLAGS,
  MOTION_DISPOSITION_VERBIAGE,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  STATE_KEYS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  UNSERVABLE_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { type RawUser } from '@shared/business/entities/User';
import {
  computeIsNotServedDocument,
  type FormattedCase,
  type FormattedCaseDetailDocketEntry,
  type FormattedDocketEntry,
  type RelatedDocketEntry,
} from '@shared/business/utilities/getFormattedCaseDetail';
import { sortBy } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';
import { type IconProp } from '@fortawesome/fontawesome-svg-core';
import { FORMATS } from '@shared/business/utilities/DateHandler';

type PreFormattedDocketEntry = Omit<
  FormattedDocketEntry,
  'descriptionDisplay' | 'iconsToDisplay' | 'toolTipText'
>;
type ComputedFormattedDocketEntry = FormattedDocketEntry & {
  isDocumentSelected: boolean;
  isSelectableForDownload: boolean;
  signatory: string;
};
type ComputedFormattedCase = FormattedCase & {
  allDocumentsSelectedForDownload: boolean;
  allEligibleDocumentsForDownload: { docketEntryId: string }[];
  docketRecordSort?: string;
  formattedDocketEntries: ComputedFormattedDocketEntry[];
  formattedDocketEntriesOnDocketRecord: ComputedFormattedDocketEntry[];
  formattedDraftDocuments: (FormattedCaseDetailDocketEntry & {
    createdAtFormatted: string;
    descriptionDisplay: string;
    showDocumentViewerLink: boolean;
  })[];
  formattedPendingDocketEntriesOnDocketRecord: ComputedFormattedDocketEntry[];
  isDownloadLinkEnabled: boolean;
  someDocumentsSelectedForDownload: boolean;
};

export const isSelectableForDownload = (entry: RawDocketEntry) => {
  return (
    !DocketEntry.isMinuteEntry(entry) &&
    entry.isFileAttached &&
    entry.isOnDocketRecord
  );
};

export const setupIconsToDisplay = ({
  formattedResult,
  isExternalUser,
}: {
  formattedResult: PreFormattedDocketEntry;
  isExternalUser: boolean;
}): {
  className: string;
  icon: IconProp;
  size: string;
  title: string;
}[] => {
  const iconsToDisplay: {
    className: string;
    icon: IconProp;
    size: string;
    title: string;
  }[] = [];

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
      icon: ['fas', 'star'],
      title: 'Is untouched',
      size: 'lg',
    });
  } else if (formattedResult.showLoadingIcon) {
    iconsToDisplay.push({
      className: 'fa-spin spinner',
      icon: ['fas', 'spinner'],
      title: 'Is loading',
      size: 'lg',
    });
  }

  return iconsToDisplay;
};

export const getShowEditDocketRecordEntry = ({
  entry,
  get,
  userPermissions,
}: {
  entry: FormattedCaseDetailDocketEntry;
  get: Get;
  userPermissions: { [k: string]: boolean };
}): boolean => {
  const systemGeneratedEventCodes: string[] = Object.keys(
    SYSTEM_GENERATED_DOCUMENT_TYPES,
  ).map(key => SYSTEM_GENERATED_DOCUMENT_TYPES[key].eventCode);

  const hasSystemGeneratedDocument =
    entry && systemGeneratedEventCodes.includes(entry.eventCode);
  const hasCourtIssuedDocument = entry && entry.isCourtIssuedDocument;
  const hasServedCourtIssuedDocument =
    hasCourtIssuedDocument && DocketEntry.isServed(entry);
  const hasUnservableCourtIssuedDocument =
    entry && UNSERVABLE_EVENT_CODES.includes(entry.eventCode);

  const eventCode = entry ? entry.eventCode : '';

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

export const getShowSealDocketRecordEntry = ({
  entry,
}: {
  entry: FormattedCaseDetailDocketEntry;
}): boolean => {
  return !OPINION_EVENT_CODES_WITH_BENCH_OPINION.includes(entry.eventCode);
};

const getRelatedDocketEntryDetails = (
  motionEntry: RawDocketEntry,
  rawCase: RawCase,
  targetDocketEntryId: string,
  isExternalUser: boolean,
  user: RawUser,
  visibilityPolicyDateFormatted: string = '',
): {
  index: number | undefined;
  showDocumentViewerLink: boolean;
  showDownloadLink: boolean;
} => {
  const relatedOrder = rawCase.docketEntries.find(
    entry => entry.docketEntryId === targetDocketEntryId,
  );

  if (!relatedOrder) {
    throw new Error(
      `Related order not found for motion with id ` +
        `${motionEntry.docketEntryId} and targetDocketEntryId ` +
        `${targetDocketEntryId} and title ${motionEntry.documentTitle}`,
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

const buildRelatedDocketEntries = ({
  entry,
  rawCase,
  isExternalUser,
  user,
  visibilityPolicyDateFormatted,
}: {
  entry: FormattedCaseDetailDocketEntry;
  rawCase: RawCase;
  isExternalUser: boolean;
  user: RawUser;
  visibilityPolicyDateFormatted: string;
}): RelatedDocketEntry[] => {
  const relatedDocketEntries: RelatedDocketEntry[] = [];

  const processEntries = (
    entries: { docketEntryId: string; disposition: string }[] | undefined,
    verbKey: 'MOTION' | 'ORDER',
  ) => {
    if (!entries) return;
    for (const affectedEntry of entries) {
      const { index, showDocumentViewerLink, showDownloadLink } =
        getRelatedDocketEntryDetails(
          entry,
          rawCase,
          affectedEntry.docketEntryId,
          isExternalUser,
          user,
          visibilityPolicyDateFormatted,
        );

      const dispositionLinkText = MOTION_DISPOSITION_VERBIAGE[
        affectedEntry.disposition
      ][verbKey].map(d => `${d} #${index}`);

      relatedDocketEntries.push({
        ...affectedEntry,
        docketEntryIndex: index,
        showDocumentViewerLink,
        showDownloadLink,
        dispositionLinkText,
        dispositionText: [],
      });
    }
  };

  processEntries(entry.affectedByDocketEntries, 'MOTION');
  processEntries(entry.affectedDocketEntries, 'ORDER');

  return relatedDocketEntries;
};

const computeSealProperties = (
  entry: FormattedCaseDetailDocketEntry,
  DOCKET_ENTRY_SEALED_TO_TYPES: { EXTERNAL: string },
): {
  sealButtonText: string;
  sealButtonTooltip: string;
  sealIcon: string;
} => {
  if (!entry.isSealed) {
    return {
      sealButtonText: 'Seal',
      sealButtonTooltip: 'Seal to the public',
      sealIcon: 'lock',
    };
  }

  const sealButtonTooltip =
    entry.sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL
      ? 'Unseal to the public and parties of this case'
      : 'Unseal to the public';

  return {
    sealButtonText: 'Unseal',
    sealButtonTooltip,
    sealIcon: 'unlock',
  };
};

const computeSealedToTooltip = ({
  applicationContext,
  entry,
  preFormattedDocketEntry,
}: {
  applicationContext: ClientApplicationContext;
  entry: FormattedCaseDetailDocketEntry;
  preFormattedDocketEntry: PreFormattedDocketEntry;
}): string => {
  if (preFormattedDocketEntry.sealedToTooltip) {
    return preFormattedDocketEntry.sealedToTooltip;
  }
  if (preFormattedDocketEntry.isSealed) {
    return applicationContext
      .getUtilities()
      .getSealedDocketEntryTooltip(applicationContext, entry);
  }
  return '';
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
}: {
  applicationContext: ClientApplicationContext;
  docketNumber: string;
  entry: FormattedCaseDetailDocketEntry;
  get: Get;
  permissions: { [k: string]: boolean };
  rawCase: RawCase;
  user: RawUser;
  visibilityPolicyDateFormatted: string;
}): FormattedDocketEntry => {
  const isExternalUser = applicationContext
    .getUtilities()
    .isExternalUser(user.role);

  const { DOCKET_ENTRY_SEALED_TO_TYPES, DOCUMENT_PROCESSING_STATUS_OPTIONS } =
    applicationContext.getConstants();

  const relatedDocketEntries = buildRelatedDocketEntries({
    entry,
    rawCase,
    isExternalUser,
    user,
    visibilityPolicyDateFormatted,
  });

  const showDocumentLinks = DocketEntry.isDownloadable(entry, {
    isTerminalUser: false,
    rawCase,
    user,
    visibilityChangeDate: visibilityPolicyDateFormatted,
  });
  const showDocumentProcessing =
    !permissions.UPDATE_CASE &&
    entry.processingStatus !== DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;

  const preFormattedDocketEntry: PreFormattedDocketEntry = {
    numberOfPages: 0,
    ...entry,
    editDocketEntryMetaLink: `/case-detail/${docketNumber}/docket-entry/${entry.index}/edit-meta`,
    isPaper:
      !entry.isInProgress && !entry.qcWorkItemsUntouched && entry.isPaper,
    relatedDocketEntries,
    ...computeSealProperties(entry, DOCKET_ENTRY_SEALED_TO_TYPES),
    showDocumentDescriptionWithoutLink:
      !showDocumentLinks && !showDocumentProcessing,
    showDocumentProcessing,
    showDocumentViewerLink: !isExternalUser && showDocumentLinks,
    showEditDocketRecordEntry: getShowEditDocketRecordEntry({
      entry,
      get,
      userPermissions: permissions,
    }),
    showLinkToDocument: isExternalUser && showDocumentLinks,
    showLoadingIcon:
      !isExternalUser &&
      !permissions.UPDATE_CASE &&
      entry.processingStatus !== DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    showNotServed: computeIsNotServedDocument({ formattedEntry: entry }),
    showSealDocketRecordEntry: getShowSealDocketRecordEntry({ entry }),
    showServed: entry.isStatusServed,
  };

  return {
    ...preFormattedDocketEntry,
    descriptionDisplay: preFormattedDocketEntry.documentTitle
      ? applicationContext
          .getUtilities()
          .getDescriptionDisplay(preFormattedDocketEntry)
      : '',
    iconsToDisplay: setupIconsToDisplay({
      formattedResult: preFormattedDocketEntry,
      isExternalUser,
    }),
    sealedToTooltip: computeSealedToTooltip({
      applicationContext,
      entry,
      preFormattedDocketEntry,
    }),
    toolTipText: entry.isFileAttached ? '' : 'No Document View',
  };
};

export const formattedDocketEntries = (
  get: Get,
  applicationContext: ClientApplicationContext,
): ComputedFormattedCase => {
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
  const visibilityPolicyDateFormatted =
    applicationContext
      .getUtilities()
      .prepareDateFromString(DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE)
      .toISO() || '';
  const formattedCase = formatCase(applicationContext, caseDetail, user);
  const documentsSelectedForDownload = get(state.documentsSelectedForDownload);

  const preformattedDocketEntries = applicationContext
    .getUtilities()
    .getDocketEntriesByFilter(applicationContext, {
      docketEntries: formattedCase.formattedDocketEntries,
      docketRecordFilter,
    });

  let docketEntriesFormatted = preformattedDocketEntries
    .map(entry =>
      getFormattedDocketEntry({
        applicationContext,
        docketNumber,
        entry: { ...entry } as FormattedCaseDetailDocketEntry,
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
        isSelectableForDownload: !!isSelectableForDownload(docketEntry),
        signatory: '',
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

  const formattedDocketEntriesOnDocketRecord = docketEntriesFormatted.filter(
    d => d.isOnDocketRecord,
  );

  const allEligibleDocumentsForDownload = docketEntriesFormatted
    .filter(docEntry => isSelectableForDownload(docEntry))
    .map(docEntry => ({
      docketEntryId: docEntry.docketEntryId,
    }));

  const formattedPendingDocketEntriesOnDocketRecord =
    formattedDocketEntriesOnDocketRecord.filter(docketEntry =>
      applicationContext.getUtilities().isPending(docketEntry),
    );

  const formattedDraftDocuments = formattedCase.draftDocuments.map(draftDoc => {
    return {
      ...draftDoc,
      createdAtFormatted: applicationContext
        .getUtilities()
        .formatDateString(draftDoc.createdAt, FORMATS.MMDDYY),
      descriptionDisplay: draftDoc.documentTitle,
      showDocumentViewerLink: permissions.UPDATE_CASE,
    };
  });

  return {
    ...formattedCase,
    allDocumentsSelectedForDownload: allDocumentsSelected || false,
    allEligibleDocumentsForDownload,
    docketRecordSort,
    formattedDocketEntries: docketEntriesFormatted,
    formattedDocketEntriesOnDocketRecord,
    formattedDraftDocuments,
    formattedPendingDocketEntriesOnDocketRecord,
    isDownloadLinkEnabled:
      someDocumentsSelectedForDownload || allDocumentsSelected,
    someDocumentsSelectedForDownload,
  };
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
