import { state } from 'cerebral';

export default get => {
  const caseDetail = get(state.caseDetail);
  return {
    showAction: (action, workItemId) => {
      const actions = get(state.workItemActions);
      return actions[workItemId] === action;
    },
    isEditablePetition: ['New', 'Recalled'].includes(caseDetail.status),
    showCaseDetailsView: caseDetail.status === 'Batched for IRS',
    showCaseDetailsEdit: ['New', 'Recalled'].includes(caseDetail.status),
    showServeToIrsButton: ['New', 'Recalled'].includes(caseDetail.status),
    showRecallButton: caseDetail.status === 'Batched for IRS',
    showDocumentInfo: get(state.currentTab) === 'Document Info',
    showPendingMessages: get(state.currentTab) === 'Pending Messages',
  };
};
