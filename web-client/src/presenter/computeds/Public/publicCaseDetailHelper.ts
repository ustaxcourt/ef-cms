/* eslint-disable complexity */
import {
  ALLOWLIST_FEATURE_FLAGS,
  BRIEF_EVENTCODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  EVENT_CODES_VISIBLE_TO_PUBLIC,
  MOTION_EVENT_CODES,
  ORDER_EVENT_CODES,
  POLICY_DATE_IMPACTED_EVENTCODES,
  PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
  isDocumentBriefType,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

const getMeetsPolicyChangeRequirements = (
  entry: RawDocketEntry & { rootDocument: RawDocketEntry },
  visibilityPolicyDateFormatted: string,
  docketEntriesEFiledByPractitioner: string[],
) => {
  if (!POLICY_DATE_IMPACTED_EVENTCODES.includes(entry.eventCode)) {
    return false;
  }

  const filedByPractitioner = docketEntriesEFiledByPractitioner.includes(
    entry.docketEntryId,
  );

  const isAmendment = ['AMAT', 'ADMT', 'REDC', 'SPML', 'SUPM'].includes(
    entry.eventCode,
  );
  const filedAfterPolicyChange =
    entry.filingDate >= visibilityPolicyDateFormatted;

  if (isAmendment) {
    const originalDocType = entry.rootDocument.documentType;

    if (isDocumentBriefType(originalDocType)) {
      return filedAfterPolicyChange && filedByPractitioner;
    }
    if (originalDocType === 'Amicus Brief') {
      return filedAfterPolicyChange;
    }
    return false;
  }

  const isDocketEntryBrief = BRIEF_EVENTCODES.includes(entry.eventCode);

  if (isDocketEntryBrief) {
    return filedAfterPolicyChange && filedByPractitioner;
  }
  return filedAfterPolicyChange;
};

export const fetchRootDocument = (
  entry: RawDocketEntry,
  docketEntries: RawDocketEntry[],
): RawDocketEntry => {
  const { previousDocument } = entry;
  if (!previousDocument) return entry;

  const previousEntry = docketEntries.find(
    e => e.docketEntryId === previousDocument.docketEntryId,
  );

  if (!previousEntry) return entry;

  return fetchRootDocument(previousEntry, docketEntries);
};

export const formatDocketEntryOnDocketRecord = (
  applicationContext,
  {
    docketEntriesEFiledByPractitioner,
    entry,
    isTerminalUser,
    visibilityPolicyDateFormatted,
  }: {
    docketEntriesEFiledByPractitioner: string[];
    entry: any & { rootDocument: any };
    isTerminalUser: boolean;
    visibilityPolicyDateFormatted: string; // ISO Date String
  },
) => {
  const isServed = !entry.isNotServedDocument;

  const meetsPolicyChangeRequirements = getMeetsPolicyChangeRequirements(
    entry,
    visibilityPolicyDateFormatted,
    docketEntriesEFiledByPractitioner,
  );

  const canTerminalUserSeeLink =
    entry.isFileAttached && isServed && !entry.isSealed && !entry.isStricken;

  const canPublicUserSeeLink =
    ((entry.isCourtIssuedDocument && !entry.isStipDecision) ||
      meetsPolicyChangeRequirements) &&
    entry.isFileAttached &&
    isServed &&
    !entry.isStricken &&
    !entry.isTranscript &&
    !entry.isSealed &&
    EVENT_CODES_VISIBLE_TO_PUBLIC.includes(entry.eventCode) &&
    entry.processingStatus === DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;

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
    createdAtFormatted: entry.createdAtFormatted,
    description: entry.description,
    descriptionDisplay: applicationContext
      .getUtilities()
      .getDescriptionDisplay(entry),
    docketEntryId: entry.docketEntryId,
    eventCode: entry.eventCode,
    filedBy: entry.filedBy,
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
    showNotServed: entry.isNotServedDocument,
    showServed: entry.isStatusServed,
    signatory: entry.signatory,
  };
};

export const publicCaseDetailHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
) => {
  const publicCase = get(state.caseDetail);
  const isTerminalUser = get(state.isTerminalUser);
  const { docketRecordFilter } = get(state.sessionMetadata);

  const formatCaseDetail = caseToFormat => ({
    ...caseToFormat,
    isCaseSealed: !!caseToFormat.isSealed,
  });

  const formattedDocketRecordsWithDocuments = publicCase.docketEntries.map(d =>
    applicationContext.getUtilities().formatDocketEntry(applicationContext, d),
  );

  const sortedFormattedDocketRecords = applicationContext
    .getUtilities()
    .sortDocketEntries(formattedDocketRecordsWithDocuments, 'byDate');

  const DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE = get(
    state.featureFlags[
      ALLOWLIST_FEATURE_FLAGS.DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key
    ],
  );

  const visibilityPolicyDateFormatted = applicationContext
    .getUtilities()
    .prepareDateFromString(DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE)
    .toISO();

  let formattedDocketEntriesOnDocketRecord = sortedFormattedDocketRecords
    .map((entry: any, _, array) => {
      return { ...entry, rootDocument: fetchRootDocument(entry, array) };
    })
    .map(entry => {
      return formatDocketEntryOnDocketRecord(applicationContext, {
        docketEntriesEFiledByPractitioner:
          publicCase.docketEntriesEFiledByPractitioner,
        entry,
        isTerminalUser,
        visibilityPolicyDateFormatted,
      });
    });

  if (docketRecordFilter === PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.orders) {
    formattedDocketEntriesOnDocketRecord =
      formattedDocketEntriesOnDocketRecord.filter(entry =>
        ORDER_EVENT_CODES.includes(entry.eventCode),
      );
  } else if (
    docketRecordFilter === PUBLIC_DOCKET_RECORD_FILTER_OPTIONS.motions
  ) {
    formattedDocketEntriesOnDocketRecord =
      formattedDocketEntriesOnDocketRecord.filter(entry =>
        MOTION_EVENT_CODES.includes(entry.eventCode),
      );
  }

  const formattedCaseDetail = formatCaseDetail(publicCase);

  const showPrintableDocketRecord =
    formattedCaseDetail.canAllowPrintableDocketRecord;

  return {
    formattedCaseDetail,
    formattedDocketEntriesOnDocketRecord,
    showPrintableDocketRecord,
  };
};
