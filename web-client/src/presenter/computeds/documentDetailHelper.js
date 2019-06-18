import { formatDocument } from './formattedCaseDetail';
import { formatWorkItem } from './formattedWorkQueue';
import { state } from 'cerebral';
import _ from 'lodash';

export const documentDetailHelper = (get, applicationContext) => {
  const caseDetail = get(state.caseDetail);

  const documentId = get(state.documentId);
  const selectedDocument = (caseDetail.documents || []).find(
    document => document.documentId === documentId,
  );
  let formattedDocument = {};
  if (selectedDocument) {
    formattedDocument = formatDocument(applicationContext, selectedDocument);
    const allWorkItems = _.orderBy(
      formattedDocument.workItems,
      'createdAt',
      'desc',
    );
    formattedDocument.workItems = (allWorkItems || [])
      .filter(items => !items.completedAt)
      .map(items => formatWorkItem(applicationContext, items));
    formattedDocument.completedWorkItems = (allWorkItems || [])
      .filter(items => items.completedAt)
      .map(items => {
        const formatted = formatWorkItem(applicationContext, items);
        formatted.messages = formatted.messages.filter(
          message => message.message.indexOf('Served on IRS') === -1,
        );
        return formatted;
      });
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
