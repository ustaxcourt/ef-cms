import { state } from 'cerebral';

const VALID_PETITION_METADATA_EDIT_STATUSES = ['New', 'Recalled'];

export default get => {
  const caseDetail = get(state.caseDetail);
  return {
    isEditablePetition:
      VALID_PETITION_METADATA_EDIT_STATUSES.indexOf(caseDetail.status) !== -1,
    showAction: (action, workItemId) => {
      const actions = get(state.workItemActions);
      return actions[workItemId] === action;
    },
    showDocumentInfo: get(state.currentTab) === 'Document Info',
    showPendingMessages: get(state.currentTab) === 'Pending Messages',
  };
};
