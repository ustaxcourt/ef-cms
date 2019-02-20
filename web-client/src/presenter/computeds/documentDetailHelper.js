import { state } from 'cerebral';
import { formatDocument } from './formattedCaseDetail';
import { formatWorkItem } from './formattedWorkQueue';

export default get => {
  const caseDetail = get(state.caseDetail);

  const documentId = get(state.documentId);
  const selectedDocument = (caseDetail.documents || []).find(
    document => document.documentId === documentId,
  );
  let formattedDocument = {};
  if (selectedDocument) {
    formattedDocument = formatDocument(selectedDocument);
    formattedDocument.workItems = (formattedDocument.workItems || [])
      .filter(items => !items.completedAt)
      .map(items => formatWorkItem(items));
  }

  return {
    showAction: (action, workItemId) => {
      const actions = get(state.workItemActions);
      return actions[workItemId] === action;
    },
    showCaseDetailsView: ['Batched for IRS'].includes(caseDetail.status),
    showCaseDetailsEdit: ['New', 'Recalled'].includes(caseDetail.status),
    showDocumentInfoTab: formattedDocument
      ? formattedDocument.isPetition
      : false,
    showDocumentInfo: get(state.currentTab) === 'Document Info',
    showPendingMessages: get(state.currentTab) === 'Pending Messages',
    formattedDocument,
  };
};
