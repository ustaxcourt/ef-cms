import { cloneDeep } from 'lodash';
import { state } from 'cerebral';

export const publicCaseDetailHelper = (get, applicationContext) => {
  const {
    DOCUMENT_PROCESSING_STATUS_OPTIONS,
  } = applicationContext.getConstants();
  const publicCase = get(state.caseDetail);

  const formatCaseDetail = caseToFormat => ({
    ...caseToFormat,
    isCaseSealed: !!caseToFormat.isSealed,
  });

  const formattedDocketRecordWithDocument = publicCase.docketEntries.map(d =>
    applicationContext.getUtilities().formatDocketEntry(applicationContext, d),
  );

  let sortedFormattedDocketRecord = applicationContext
    .getUtilities()
    .sortDocketEntries(formattedDocketRecordWithDocument, 'byIndex');

  sortedFormattedDocketRecord = applicationContext
    .getUtilities()
    .sortDocketEntries(sortedFormattedDocketRecord, 'byDate');

  const formattedDocketEntriesOnDocketRecord = sortedFormattedDocketRecord.map(
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
        showDocumentDescriptionWithoutLink:
          record.isStricken ||
          !record.isCourtIssuedDocument ||
          record.isNotServedDocument ||
          record.isTranscript,
        showLinkToDocument:
          record.processingStatus ===
            DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE &&
          record.isCourtIssuedDocument &&
          !record.isNotServedDocument &&
          !record.isStricken &&
          !record.isTranscript,
        showNotServed: record.isNotServedDocument,
        showServed: record.isStatusServed,
        signatory: record.signatory,
      };
    },
  );

  const formattedCaseDetail = formatCaseDetail(publicCase);

  return {
    formattedCaseDetail,
    formattedDocketEntriesOnDocketRecord,
  };
};
