import { state } from 'cerebral';

export const documentViewerLinksHelper = get => {
  const caseDetail = get(state.caseDetail);

  const viewerDocumentToDisplay = get(state.viewerDocumentToDisplay);

  if (!viewerDocumentToDisplay) {
    return {};
  }

  return {
    completeQcLink: `/case-detail/${caseDetail.docketNumber}/documents/${viewerDocumentToDisplay.docketEntryId}/edit`,
    documentViewerLink: `/case-detail/${caseDetail.docketNumber}/document-view?docketEntryId=${viewerDocumentToDisplay.docketEntryId}`,
    reviewAndServePetitionLink: `/case-detail/${caseDetail.docketNumber}/petition-qc/document-view/${viewerDocumentToDisplay.docketEntryId}`,
    signStipulatedDecisionLink: `/case-detail/${caseDetail.docketNumber}/edit-order/${viewerDocumentToDisplay.docketEntryId}/sign`,
  };
};
