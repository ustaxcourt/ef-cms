import { state } from 'cerebral';

export const publicCaseDetailHelper = (get, applicationContext) => {
  const publicCase = get(state.caseDetail);

  const formatCaseDetail = caseToFormat => ({
    ...caseToFormat,
    isCaseSealed: !!caseToFormat.isSealed,
  });

  const formattedDocketRecord = publicCase.docketRecord.map(d =>
    applicationContext.getUtilities().formatDocketRecord(applicationContext, d),
  );

  const formattedDocketRecordWithDocument = applicationContext
    .getUtilities()
    .formatDocketRecordWithDocument(
      applicationContext,
      formattedDocketRecord,
      publicCase.documents,
    );

  let sortedFormattedDocketRecord = applicationContext
    .getUtilities()
    .sortDocketRecords(formattedDocketRecordWithDocument, 'byIndex');

  sortedFormattedDocketRecord = applicationContext
    .getUtilities()
    .sortDocketRecords(sortedFormattedDocketRecord, 'byDate');

  const formattedDocketEntries = sortedFormattedDocketRecord.map(
    ({ document, index, record }) => {
      let filingsAndProceedingsWithAdditionalInfo = '';
      if (document && document.documentTitle && document.additionalInfo) {
        filingsAndProceedingsWithAdditionalInfo += ` ${document.additionalInfo}`;
      }
      if (record.filingsAndProceedings) {
        filingsAndProceedingsWithAdditionalInfo += ` ${record.filingsAndProceedings}`;
      }
      if (document && document.additionalInfo2) {
        filingsAndProceedingsWithAdditionalInfo += ` ${document.additionalInfo2}`;
      }

      return {
        action: record.action,
        createdAtFormatted: record.createdAtFormatted,
        description: record.description,
        descriptionDisplay:
          (document && document.documentTitle) || record.description,
        documentId: document && document.documentId,
        eventCode: record.eventCode || (document && document.eventCode),
        filedBy: document && document.filedBy,
        filingsAndProceedingsWithAdditionalInfo,
        hasDocument: !!document,
        index,
        isPaper: document && document.isPaper,
        numberOfPages:
          (document && (record.numberOfPages || document.numberOfPages)) || 0,
        servedAtFormatted: document && document.servedAtFormatted,
        servedPartiesCode: document && document.servedPartiesCode,
        showDocumentDescriptionWithoutLink:
          !document ||
          (document &&
            (!document.isCourtIssuedDocument ||
              document.isNotServedCourtIssuedDocument ||
              document.isTranscript)),
        showLinkToDocument:
          document &&
          document.processingStatus === 'complete' &&
          document.isCourtIssuedDocument &&
          !document.isNotServedCourtIssuedDocument &&
          !document.isTranscript,
        showNotServed: document && document.isNotServedCourtIssuedDocument,
        showServed: document && document.isStatusServed,
        signatory: record.signatory,
      };
    },
  );

  const formattedCaseDetail = formatCaseDetail(publicCase);

  return {
    formattedCaseDetail,
    formattedDocketEntries,
  };
};
