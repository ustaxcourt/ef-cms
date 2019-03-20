import _ from 'lodash';
import { formatDocument } from './formattedCaseDetail';
import { formatWorkItem } from './formattedWorkQueue';
import { state } from 'cerebral';

export const documentDetailHelper = get => {
  const caseDetail = get(state.caseDetail);

  const documentId = get(state.documentId);
  const selectedDocument = (caseDetail.documents || []).find(
    document => document.documentId === documentId,
  );
  let formattedDocument = {};
  if (selectedDocument) {
    formattedDocument = formatDocument(selectedDocument);
    const allWorkItems = _.orderBy(
      formattedDocument.workItems,
      'createdAt',
      'desc',
    );
    formattedDocument.workItems = (allWorkItems || [])
      .filter(items => !items.completedAt)
      .map(items => formatWorkItem(items));
    formattedDocument.completedWorkItems = (allWorkItems || [])
      .filter(items => items.completedAt)
      .map(items => formatWorkItem(items));
  }

  const formattedDocumentIsPetition =
    (formattedDocument && formattedDocument.isPetition) || false;
  const showCaseDetailsEdit = ['New', 'Recalled'].includes(caseDetail.status);
  const showCaseDetailsView = ['Batched for IRS'].includes(caseDetail.status);
  const showDocumentInfoTab =
    formattedDocumentIsPetition && (showCaseDetailsEdit || showCaseDetailsView);

  return {
    formattedDocument,
    showAction: (action, workItemId) => {
      const actions = get(state.workItemActions);
      return actions[workItemId] === action;
    },
    showCaseDetailsEdit,
    showCaseDetailsView,
    showDocumentInfoTab,
  };
};
