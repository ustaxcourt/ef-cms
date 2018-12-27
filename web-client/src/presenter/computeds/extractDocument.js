import { state } from 'cerebral';
import { formatDocument } from './formattedCaseDetail';

export const extractedDocument = get => {
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);
  const selectedDocument = (caseDetail.documents || []).find(
    document => document.documentId === documentId,
  );
  if (!selectedDocument) return {};
  return formatDocument(selectedDocument);
};
