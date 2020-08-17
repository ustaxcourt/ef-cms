import { state } from 'cerebral';

export const printPaperServiceHelper = get => {
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);
  if (caseDetail && documentId) {
    const document = caseDetail.documents.find(
      d => d.documentId === documentId,
    );
    return { documentTitle: document.documentType };
  } else {
    return {};
  }
};
