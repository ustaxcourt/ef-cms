import { state } from 'cerebral';

export default get => {
  return {
    showAction: (action, workItemId) => {
      const actions = get(state.workItemActions);
      return actions[workItemId] === action;
    },
    showDocumentInfo: get(state.currentTab) === 'Document Info',
    showPendingMessages: get(state.currentTab) === 'Pending Messages',
  };
};
