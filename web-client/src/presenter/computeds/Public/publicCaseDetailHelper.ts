/* eslint-disable complexity */
import {
  ALLOWLIST_FEATURE_FLAGS,
  PUBLIC_DOCKET_RECORD_FILTER,
  PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { Get } from 'cerebral';
import { getFilingsAndProceedings } from '../../../../../shared/src/business/utilities/getFormattedCaseDetail';
import { state } from '@web-client/presenter/app-public.cerebral';

export const formatDocketEntryOnDocketRecord = (
  applicationContext,
  {
    entry,
    isTerminalUser,
    visibilityPolicyDate,
  }: {
    entry: any & { rootDocument: any };
    isTerminalUser: boolean;
    visibilityPolicyDate: string; // ISO Date String
  },
) => {
  const isServed =
    DocketEntry.isServed(entry) || DocketEntry.isUnservable(entry.eventCode);

  const isCourtIssued = DocketEntry.isCourtIssued(entry.eventCode);

  let createdAtFormatted;
  if (
    isCourtIssued &&
    !DocketEntry.isServed(entry) &&
    !DocketEntry.isUnservable(entry.eventCode) &&
    entry.isOnDocketRecord
  ) {
    entry.createdAtFormatted = undefined;
  } else if (entry.isOnDocketRecord) {
    createdAtFormatted = applicationContext
      .getUtilities()
      .formatDateString(entry.filingDate, 'MMDDYY');
  } else {
    createdAtFormatted = applicationContext
      .getUtilities()
      .formatDateString(entry.createdAt, 'MMDDYY');
  }

  if (entry.lodged) {
    entry.eventCode = 'MISCL';
  }

  entry.servedAtFormatted = applicationContext
    .getUtilities()
    .formatDateString(entry.servedAt, 'MMDDYY');

  entry.filingsAndProceedings = getFilingsAndProceedings(entry);

  const canPublicUserSeeLink = DocketEntry.isPublic(entry, {
    rootDocument: entry.rootDocument,
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
    hasDocument: !entry.isMinuteEntry,
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
    showNotServed:
      !DocketEntry.isServed(entry) &&
      !DocketEntry.isUnservable(entry.eventCode),
    showServed: DocketEntry.isServed(entry),
    signatory: entry.signatory,
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

export const publicCaseDetailHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const {
    canAllowPrintableDocketRecord,
    docketEntries,
    docketNumber,
    isSealed,
  } = get(state.caseDetail);

  const isTerminalUser = get(state.isTerminalUser);

  const { docketRecordFilter } = get(state.sessionMetadata);

  const visibilityPolicyDate = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key
    ],
  );

  let formattedDocketEntriesOnDocketRecord = docketEntries
    .map((entry: any, _, array) => {
      return { ...entry, rootDocument: fetchRootDocument(entry, array) };
    })
    .map(entry => {
      return formatDocketEntryOnDocketRecord(applicationContext, {
        entry,
        isTerminalUser,
        visibilityPolicyDate,
      });
    });

  const { docketRecordSort } = get(state.sessionMetadata);
  const sortOrder = docketRecordSort[docketNumber];

  const sortedFormattedDocketRecords = applicationContext
    .getUtilities()
    .sortDocketEntries(formattedDocketEntriesOnDocketRecord as any, sortOrder);

  formattedDocketEntriesOnDocketRecord = filterDocketEntries(
    sortedFormattedDocketRecords,
    docketRecordFilter,
  );

  return {
    formattedDocketEntriesOnDocketRecord,
    isCaseSealed: !!isSealed,
    showPrintableDocketRecord: canAllowPrintableDocketRecord,
  };
};
