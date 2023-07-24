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
import { cloneDeep } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const formatDocketEntryOnDocketRecord = (
  applicationContext,
  {
    docketEntriesEFiledByPractitioner,
    entry,
    isTerminalUser,
    visibilityPolicyDateFormatted,
  },
) => {
  const record = cloneDeep(entry);

  const isServedDocument = !record.isNotServedDocument;

  let filedByPractitioner = false;
  let meetsPolicyChangeRequirements = false;
  const isAmmemendment = ['AMAT', 'ADMT', 'REDC', 'SPML', 'SUPM'].includes(
    entry.eventCode,
  );
  const filedAfterPolicyChange =
    record.filingDate >= visibilityPolicyDateFormatted;
  let shouldCheckPolicyDate = false;

  if (POLICY_DATE_IMPACTED_EVENTCODES.includes(entry.eventCode)) {
    let isDocketEntryBriefEventCode;
    shouldCheckPolicyDate = true;

    if (isAmmemendment) {
      isDocketEntryBriefEventCode = isDocumentBriefType(
        entry.previousDocument.documentType,
      );
    } else {
      isDocketEntryBriefEventCode = BRIEF_EVENTCODES.includes(entry.eventCode);
    }
    if (isDocketEntryBriefEventCode) {
      filedByPractitioner = docketEntriesEFiledByPractitioner.includes(
        entry.docketEntryId,
      );
      meetsPolicyChangeRequirements =
        filedAfterPolicyChange && filedByPractitioner;
    }
  }

  // const meetsPolicyChangeRequirements =
  //   filedAfterPolicyChange &&
  //   (requiresPractitionerCheck ? filedByPractitioner : true);

  let canTerminalUserSeeLink =
    record.isFileAttached &&
    isServedDocument &&
    !record.isSealed &&
    !record.isStricken;

  let canPublicUserSeeLink =
    ((record.isCourtIssuedDocument && !record.isStipDecision) ||
      (shouldCheckPolicyDate && meetsPolicyChangeRequirements)) &&
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
