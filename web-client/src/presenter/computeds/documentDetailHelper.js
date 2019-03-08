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
    const allWorkItems = formattedDocument.workItems;
    formattedDocument.workItems = (allWorkItems || [])
      .filter(items => !items.completedAt)
      .map(items => formatWorkItem(items));
    formattedDocument.completedWorkItems = (allWorkItems || [])
      .filter(items => items.completedAt)
      .map(items => formatWorkItem(items));
  }

  return {
    formattedDocument,
    showAction: (action, workItemId) => {
      const actions = get(state.workItemActions);
      return actions[workItemId] === action;
    },
    showCaseDetailsEdit: ['New', 'Recalled'].includes(caseDetail.status),
    showCaseDetailsView: ['Batched for IRS'].includes(caseDetail.status),
    showDocumentInfo: get(state.currentTab) === 'Document Info',
    showDocumentInfoTab: formattedDocument
      ? formattedDocument.isPetition
      : false,
    showPendingMessages: get(state.currentTab) === 'Pending Messages',
  };
};
