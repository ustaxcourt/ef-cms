import { state } from 'cerebral';

export const draftDocumentViewerHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);

  const formattedCaseDetail = applicationContext
    .getUtilities()
    .getFormattedCaseDetail({
      applicationContext,
      caseDetail,
    });

  const viewerDraftDocumentToDisplay = get(state.viewerDraftDocumentToDisplay);

  const formattedDocumentToDisplay =
    viewerDraftDocumentToDisplay &&
    formattedCaseDetail.draftDocuments &&
    formattedCaseDetail.draftDocuments.find(
      draftDocument =>
        draftDocument.documentId === viewerDraftDocumentToDisplay.documentId,
    );
  if (!formattedDocumentToDisplay) {
    return {
      descriptionDisplay: 'Nothing',
      filedLabel: 'Nothing',
      servedLable: 'Nothing',
    };
  }
  const filedLabel = formattedDocumentToDisplay.filedBy
    ? `Filed ${formattedDocumentToDisplay.createdAtFormatted} by ${formattedDocumentToDisplay.filedBy}`
    : '';

  const { servedAtFormatted } = formattedDocumentToDisplay;
  const servedLabel = servedAtFormatted ? `Served ${servedAtFormatted}` : '';

  return {
    descriptionDisplay: formattedDocumentToDisplay.descriptionDisplay,
    filedLabel,
    servedLabel,
  };
};
