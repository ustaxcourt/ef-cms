import { state } from 'cerebral';

/**
 * sets the state.workItemActions based on the props.action and props.workItemId passed in.
 * The action is either history, forward, complete.
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state.workItemActions
 * @param {object} providers.store the cerebral store used for setting state.workItemActions
 * @param {object} providers.props the cerebral props object used for getting the props.action and props.workItemId
 */
export const setWorkItemActionMapAction = ({ get, store, props }) => {
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
  store.set(state.workItemMetadata, {});
};
