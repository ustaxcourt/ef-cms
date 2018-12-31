import { state } from 'cerebral';

export default ({ get, store, props }) => {
  const actions = get(state.workItemActions);
  const workItemId = props.workItemId;
  if (!props.action) {
    delete actions[workItemId];
  } else if (props.action === actions[workItemId]) {
    delete actions[workItemId];
  } else {
    actions[workItemId] = props.action;
  }
  store.set(state.workItemActions, actions);
};
