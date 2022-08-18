/* eslint-disable complexity */

import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

export const formatDocketEntryOnDocketRecord = (
  applicationContext,
  { entry, isTerminalUser },
) => {
  const { DOCUMENT_PROCESSING_STATUS_OPTIONS, EVENT_CODES_VISIBLE_TO_PUBLIC } =
    applicationContext.getConstants();
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

  const canTerminalUserSeeLink =
    record.isFileAttached && isServedDocument && !record.isSealed;

  const canPublicUserSeeLink =
    record.isCourtIssuedDocument &&
    record.isFileAttached &&
    isServedDocument &&
    !record.isStricken &&
    !record.isTranscript &&
    !record.isStipDecision &&
    !record.isSealed &&
    EVENT_CODES_VISIBLE_TO_PUBLIC.includes(record.eventCode);

  const canDisplayDocumentLink = isTerminalUser
    ? canTerminalUserSeeLink
    : canPublicUserSeeLink;

  const showDocumentDescriptionWithoutLink = !canDisplayDocumentLink;
  const showLinkToDocument =
    canDisplayDocumentLink &&
    record.processingStatus === DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;

  if (record.isSealed) {
    record.sealedToTooltip = applicationContext
      .getUtilities()
      .getSealedDocketEntryTooltip(applicationContext, record);
  }

  if (entry.eventCode === 'OCS' && record.freeText) {
    record.descriptionDisplay = `${record.freeText} - ${record.descriptionDisplay}`;
  } else {
    record.descriptionDisplay = record.documentTitle || record.description;
  }

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
  const publicCase = get(state.caseDetail);
  const isTerminalUser = get(state.isTerminalUser);

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

  const formattedDocketEntriesOnDocketRecord = sortedFormattedDocketRecords.map(
    entry =>
      formatDocketEntryOnDocketRecord(applicationContext, {
        entry,
        isTerminalUser,
      }),
  );

  const formattedCaseDetail = formatCaseDetail(publicCase);

  const showPrintableDocketRecord =
    formattedCaseDetail.canAllowPrintableDocketRecord;

  return {
    formattedCaseDetail,
    formattedDocketEntriesOnDocketRecord,
    showPrintableDocketRecord,
  };
};
