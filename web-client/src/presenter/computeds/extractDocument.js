import { state } from 'cerebral';
import { formatDocument } from './formattedCaseDetail';

export const extractedDocument = get => {
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);
  return formatDocument(
    caseDetail.documents.find(document => document.documentId === documentId),
  );
};
