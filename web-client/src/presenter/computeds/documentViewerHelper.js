import { state } from 'cerebral';

export const documentViewerHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      caseDetail,
    });

  const viewerDocumentToDisplay = get(state.viewerDocumentToDisplay);

  const formattedDocumentToDisplay =
    viewerDocumentToDisplay &&
    formattedCaseDetail.docketRecordWithDocument.find(
      entry =>
        entry.document &&
        entry.document.documentId === viewerDocumentToDisplay.documentId,
    );

  const filedLabel = formattedDocumentToDisplay.document.filedBy
    ? `Filed ${formattedDocumentToDisplay.document.createdAtFormatted} by ${formattedDocumentToDisplay.document.filedBy}`
    : '';

  const { servedAtFormatted } = formattedDocumentToDisplay.document;
  const servedLabel = servedAtFormatted ? `Served ${servedAtFormatted}` : '';

  return {
    description: formattedDocumentToDisplay.record.description,
    filedLabel,
    servedLabel,
    showSealedInBlackstone: formattedDocumentToDisplay.document.isLegacySealed,
  };
};
