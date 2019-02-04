import { state } from 'cerebral';

export default get => {
  const caseDetail = get(state.caseDetail);
  return {
    showAction: (action, workItemId) => {
      const actions = get(state.workItemActions);
      return actions[workItemId] === action;
    },
    showCaseDetailsView: caseDetail.status === 'Batched for IRS',
    showCaseDetailsEdit: ['New', 'Recalled'].includes(caseDetail.status),
    showDocumentInfo: get(state.currentTab) === 'Document Info',
    showPendingMessages: get(state.currentTab) === 'Pending Messages',
  };
};
