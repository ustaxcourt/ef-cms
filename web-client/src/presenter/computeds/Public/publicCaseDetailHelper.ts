/* eslint-disable complexity */

import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

export const formatDocketEntryOnDocketRecord = (
  applicationContext,
  {
    docketEntriesEFiledByPractitioner,
    entry,
    isTerminalUser,
    visibilityPolicyDateFormatted,
  },
) => {
  const {
    BRIEF_EVENTCODES,
    DOCUMENT_PROCESSING_STATUS_OPTIONS,
    EVENT_CODES_VISIBLE_TO_PUBLIC,
    POLICY_DATE_IMPACTED_EVENTCODES,
  } = applicationContext.getConstants();
  const record = cloneDeep(entry);

  let filingsAndProceedingsWithAdditionalInfo = '';
  if (record.documentTitle && record.additionalInfo) {
    filingsAndProceedingsWithAdditionalInfo += ` ${record.additionalInfo}`;
  }
  if (record.filingsAndProceedings) {
    filingsAndProceedingsWithAdditionalInfo += ` ${record.filingsAndProceedings}`;
  }
  if (record.additionalInfo2) {
    filingsAndProceedingsWithAdditionalInfo += ` ${record.additionalInfo2}`;
  }

  const isServedDocument = !record.isNotServedDocument;

  let filedByPractitioner: boolean = false;
  let requiresPractitionerCheck: boolean = false;
  let filedAfterPolicyChange: boolean = false;
  const isDocketEntryBriefEventCode = BRIEF_EVENTCODES.includes(
    entry.eventCode,
  );
  if (POLICY_DATE_IMPACTED_EVENTCODES.includes(entry.eventCode)) {
    filedAfterPolicyChange = record.filingDate >= visibilityPolicyDateFormatted;
    if (isDocketEntryBriefEventCode) {
      requiresPractitionerCheck = true;
      filedByPractitioner = docketEntriesEFiledByPractitioner.includes(
        entry.docketEntryId,
      );
    }
  }

  const meetsPolicyChangeRequirements =
    filedAfterPolicyChange &&
    (requiresPractitionerCheck ? filedByPractitioner : true);

  let canTerminalUserSeeLink =
    record.isFileAttached &&
    isServedDocument &&
    !record.isSealed &&
    !record.isStricken;

  if (POLICY_DATE_IMPACTED_EVENTCODES.includes(entry.eventCode)) {
    canTerminalUserSeeLink =
      canTerminalUserSeeLink && meetsPolicyChangeRequirements;
  }

  let canPublicUserSeeLink =
    ((record.isCourtIssuedDocument && !record.isStipDecision) ||
      meetsPolicyChangeRequirements) &&
    record.isFileAttached &&
    isServedDocument &&
    !record.isStricken &&
    !record.isTranscript &&
    !record.isSealed &&
    EVENT_CODES_VISIBLE_TO_PUBLIC.includes(record.eventCode);

  const canDisplayDocumentLink = isTerminalUser
    ? canTerminalUserSeeLink
    : canPublicUserSeeLink;

  const showDocumentDescriptionWithoutLink = !canDisplayDocumentLink;

  let showLinkToDocument = canDisplayDocumentLink;

  if (!isTerminalUser) {
    showLinkToDocument =
      canDisplayDocumentLink &&
      record.processingStatus === DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;
  }

  if (record.isSealed) {
    record.sealedToTooltip = applicationContext
      .getUtilities()
      .getSealedDocketEntryTooltip(applicationContext, record);
  }

  record.descriptionDisplay = applicationContext
    .getUtilities()
    .getDescriptionDisplay(record);

  return {
    action: record.action,
    createdAtFormatted: record.createdAtFormatted,
    description: record.description,
    descriptionDisplay: record.descriptionDisplay,
    docketEntryId: record.docketEntryId,
    eventCode: record.eventCode,
    filedBy: record.filedBy,
    filingsAndProceedingsWithAdditionalInfo,
    hasDocument: !record.isMinuteEntry,
    index: record.index,
    isPaper: record.isPaper,
    isSealed: record.isSealed,
    isStricken: record.isStricken,
    numberOfPages: record.numberOfPages || 0,
    openInSameTab: !isTerminalUser,
    sealedToTooltip: record.sealedToTooltip,
    servedAtFormatted: record.servedAtFormatted,
    servedPartiesCode: record.servedPartiesCode,
    showDocumentDescriptionWithoutLink,
    showLinkToDocument,
    showNotServed: record.isNotServedDocument,
    showServed: record.isStatusServed,
    signatory: record.signatory,
  };
};

export const publicCaseDetailHelper = (get, applicationContext) => {
  const {
    ALLOWLIST_FEATURE_FLAGS,
    MOTION_EVENT_CODES,
    ORDER_EVENT_CODES,
    PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
  } = applicationContext.getConstants();
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

  let formattedDocketEntriesOnDocketRecord = sortedFormattedDocketRecords.map(
    entry => {
      return formatDocketEntryOnDocketRecord(applicationContext, {
        docketEntriesEFiledByPractitioner:
          publicCase.docketEntriesEFiledByPractitioner,
        entry,
        isTerminalUser,
        visibilityPolicyDateFormatted,
      });
    },
  );

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
