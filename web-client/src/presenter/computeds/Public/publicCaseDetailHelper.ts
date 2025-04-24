import {
  ALLOWLIST_FEATURE_FLAGS,
  PUBLIC_DOCKET_RECORD_FILTER,
  PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
  ROLES,
  STATE_KEYS,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { Get } from 'cerebral';
import {
  computeIsNotServedDocument,
  getFilingsAndProceedings,
} from '../../../../../shared/src/business/utilities/getFormattedCaseDetail';
import { sortDocketEntryTable } from '@web-client/presenter/computeds/formattedDocketEntries';
import { state } from '@web-client/presenter/app-public.cerebral';
import { formatDateString } from '@shared/business/utilities/DateHandler';

export const formatDocketEntryOnDocketRecord = (
  applicationContext,
  {
    entry,
    isTerminalUser,
    rawCase,
    visibilityPolicyDate,
  }: {
    entry: any & { rootDocument: any };
    isTerminalUser: boolean;
    rawCase: RawPublicCase;
    visibilityPolicyDate: string; // ISO Date String
  },
) => {
  const isServed =
    DocketEntry.isServed(entry) || DocketEntry.isUnservable(entry);

  const isCourtIssued = DocketEntry.isCourtIssued(entry);

  let createdAtFormatted;
  let sortingFilingDate;
  if (
    isCourtIssued &&
    !DocketEntry.isServed(entry) &&
    !DocketEntry.isUnservable(entry) &&
    entry.isOnDocketRecord
  ) {
    entry.createdAtFormatted = undefined;
  } else if (entry.isOnDocketRecord) {
    createdAtFormatted = applicationContext
      .getUtilities()
      .formatDateString(entry.filingDate, 'MMDDYY');
    sortingFilingDate = applicationContext
      .getUtilities()
      .formatDateString(entry.filingDate, 'YYYYMMDD_NUMERIC');
  } else {
    createdAtFormatted = applicationContext
      .getUtilities()
      .formatDateString(entry.createdAt, 'MMDDYY');
    sortingFilingDate = applicationContext
      .getUtilities()
      .formatDateString(entry.createdAt, 'YYYYMMDD_NUMERIC');
  }

  if (entry.lodged) {
    entry.eventCode = 'MISCL';
  }

  entry.servedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(entry.servedAt, 'MMDDYY');

  if (entry.certificateOfService) {
    entry.certificateOfServiceDateFormatted = formatDateString(
      entry.certificateOfServiceDate,
      'MMDDYY',
    );
  }

  entry.filingsAndProceedings = getFilingsAndProceedings(entry);

  const canPublicUserSeeLink = DocketEntry.isDownloadable(entry, {
    isTerminalUser,
    rawCase,
    user: {
      role: ROLES.petitioner,
      userId: '',
    },
    visibilityChangeDate: visibilityPolicyDate,
  });

  const canTerminalUserSeeLink =
    entry.isFileAttached && isServed && !entry.isSealed && !entry.isStricken;

  const showLinkToDocument = isTerminalUser
    ? canTerminalUserSeeLink
    : canPublicUserSeeLink;

  if (entry.isSealed) {
    entry.sealedToTooltip = applicationContext
      .getUtilities()
      .getSealedDocketEntryTooltip(applicationContext, entry);
  }

  return {
    action: entry.action,
    createdAtFormatted,
    description: entry.description,
    descriptionDisplay: applicationContext
      .getUtilities()
      .getDescriptionDisplay(entry),
    docketEntryId: entry.docketEntryId,
    eventCode: entry.eventCode,
    filedBy: entry.filedBy,
    filingDate: entry.filingDate,
    hasDocument: !DocketEntry.isMinuteEntry(entry),
    index: entry.index,
    isPaper: entry.isPaper,
    isSealed: entry.isSealed,
    isStricken: entry.isStricken,
    numberOfPages: entry.numberOfPages || 0,
    openInSameTab: !isTerminalUser,
    sealedToTooltip: entry.sealedToTooltip,
    servedAtFormatted: entry.servedAtFormatted,
    servedPartiesCode: entry.servedPartiesCode,
    showDocumentDescriptionWithoutLink: !showLinkToDocument,
    showLinkToDocument,
    showNotServed: computeIsNotServedDocument({ formattedEntry: entry }),
    showServed: DocketEntry.isServed(entry),
    signatory: entry.signatory,
    sortingFilingDate,
  };
};

const filterDocketEntries = (
  docketEntries: any[],
  filter: PUBLIC_DOCKET_RECORD_FILTER,
) => {
  switch (filter) {
    case PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.motions:
      return docketEntries.filter(entry =>
        DocketEntry.isMotion(entry.eventCode),
      );
    case PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.orders:
      return docketEntries.filter(entry =>
        DocketEntry.isOrder(entry.eventCode),
      );
    case PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.allDocuments:
    default:
      return docketEntries;
  }
};

export type PublicFormattedDocketEntryInfo = {
  index: number;
  isStricken?: boolean;
  createdAtFormatted?: string;
  eventCode: string;
  isSealed?: boolean;
  sealedToTooltip: string;
  numberOfPages?: number;
  filedBy?: string;
  action?: string;
  showServed: boolean;
  showNotServed: boolean;
  servedAtFormatted: boolean;
  servedPartiesCode?: string;
  showLinkToDocument: boolean;
  descriptionDisplay: string;
  docketEntryId: string;
  openInSameTab: boolean;
  showDocumentDescriptionWithoutLink: boolean;
  signatory?: string;
  hasDocument: boolean;
};

export type PublicCaseDetailHelperResults = {
  formattedDocketEntriesOnDocketRecord: PublicFormattedDocketEntryInfo[];
  isCaseSealed: boolean;
  showPrintableDocketRecord: string | undefined;
};

export const publicCaseDetailHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): PublicCaseDetailHelperResults => {
  const rawCase = get(state.caseDetail);

  const { canAllowPrintableDocketRecord, docketEntries, isSealed } = rawCase;

  const isTerminalUser = get(state.isTerminalUser);
  const { sortField, sortOrder } = get(
    state[STATE_KEYS.DOCKET_RECORD_TABLE_SORT],
  );

  const { docketRecordFilter } = get(state.sessionMetadata);

  const visibilityPolicyDate = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key
    ],
  );

  const formattedDocketEntriesOnDocketRecord = docketEntries.map(entry => {
    return formatDocketEntryOnDocketRecord(applicationContext, {
      entry,
      isTerminalUser,
      rawCase,
      visibilityPolicyDate,
    });
  });

  const filteredFormattedDocketEntriesOnDocketRecord = filterDocketEntries(
    formattedDocketEntriesOnDocketRecord,
    docketRecordFilter,
  );

  const sortedAndFilteredFormattedDocketEntriesOnDocketRecord =
    sortDocketEntryTable<PublicFormattedDocketEntryInfo>(
      filteredFormattedDocketEntriesOnDocketRecord,
      sortField,
      sortOrder,
    );

  return {
    formattedDocketEntriesOnDocketRecord:
      sortedAndFilteredFormattedDocketEntriesOnDocketRecord,
    isCaseSealed: !!isSealed,
    showPrintableDocketRecord: canAllowPrintableDocketRecord,
  };
};
