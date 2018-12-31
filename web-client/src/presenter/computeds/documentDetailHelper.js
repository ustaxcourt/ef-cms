import { state } from 'cerebral';

export const showAction = get => (action, workItemId) => {
  const actions = get(state.workItemActions);
  return actions[workItemId] === action;
};
