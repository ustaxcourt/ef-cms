import { formatDocument } from './formattedCaseDetail';
import { formatWorkItem } from './formattedWorkQueue';
import { state } from 'cerebral';

export const extractedDocument = get => {
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);
  const selectedDocument = (caseDetail.documents || []).find(
    document => document.documentId === documentId,
  );
  if (!selectedDocument) return {};
  const formattedDocument = formatDocument(selectedDocument);
  formattedDocument.workItems = (formattedDocument.workItems || [])
    .filter(items => !items.completedAt)
    .map(items => formatWorkItem(items));
  return formattedDocument;
};
