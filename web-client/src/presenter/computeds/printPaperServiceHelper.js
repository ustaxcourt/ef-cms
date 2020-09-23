import { state } from 'cerebral';

export const printPaperServiceHelper = get => {
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);
  if (documentId) {
    const document = caseDetail.docketEntries.find(
      d => d.documentId === documentId,
    );
    return { documentTitle: document.documentType };
  } else {
    return {};
  }
};
