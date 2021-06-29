import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

export const publicCaseDetailHelper = (get, applicationContext) => {
  const { DOCUMENT_PROCESSING_STATUS_OPTIONS, EVENT_CODES_VISIBLE_TO_PUBLIC } =
    applicationContext.getConstants();
  const publicCase = get(state.caseDetail);

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
    entry => {
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

      const canDisplayDocumentLink =
        record.isCourtIssuedDocument &&
        record.isFileAttached &&
        !record.isNotServedDocument &&
        !record.isStricken &&
        !record.isTranscript &&
        !record.isStipDecision &&
        EVENT_CODES_VISIBLE_TO_PUBLIC.includes(record.eventCode);

      const showDocumentDescriptionWithoutLink = !canDisplayDocumentLink;
      const showLinkToDocument =
        canDisplayDocumentLink &&
        record.processingStatus === DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;

      return {
        action: record.action,
        createdAtFormatted: record.createdAtFormatted,
        description: record.description,
        descriptionDisplay: record.documentTitle || record.description,
        docketEntryId: record.docketEntryId,
        eventCode: record.eventCode,
        filedBy: record.filedBy,
        filingsAndProceedingsWithAdditionalInfo,
        hasDocument: !record.isMinuteEntry,
        index: record.index,
        isPaper: record.isPaper,
        isStricken: record.isStricken,
        numberOfPages: record.numberOfPages || 0,
        servedAtFormatted: record.servedAtFormatted,
        servedPartiesCode: record.servedPartiesCode,
        showDocumentDescriptionWithoutLink,
        showLinkToDocument,
        showNotServed: record.isNotServedDocument,
        showServed: record.isStatusServed,
        signatory: record.signatory,
      };
    },
  );

  const formattedCaseDetail = formatCaseDetail(publicCase);

  const showPrintableDocketRecord = !formattedCaseDetail.isStatusNew;

  return {
    formattedCaseDetail,
    formattedDocketEntriesOnDocketRecord,
    showPrintableDocketRecord,
  };
};
