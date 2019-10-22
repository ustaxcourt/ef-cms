import { formatWorkItem } from './formattedWorkQueue';
import { state } from 'cerebral';

export const extractedDocument = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);
  const documentId = get(state.documentId);
  const USER_ROLES = get(state.constants.USER_ROLES);
  const selectedDocument = (caseDetail.documents || []).find(
    document => document.documentId === documentId,
  );
  if (!selectedDocument) return {};
  const formattedDocument = applicationContext
    .getUtilities()
    .formatDocument(applicationContext, selectedDocument);
  formattedDocument.workItems = (formattedDocument.workItems || [])
    .filter(items => !items.completedAt)
    .map(items =>
      formatWorkItem({
        USER_ROLES,
        applicationContext,
        workItem: items,
      }),
    );
  return formattedDocument;
};
