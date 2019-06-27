import { state } from 'cerebral';

/**
 * used to keep track of which work items (props.workItemId) were focused based on which props.queueType
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting the state.caseDetail
 * @param {object} providers.store the cerebral store used for setting the state.form
 * @param {object} providers.props the cerebral props object used for passing the props.workItemId
 */
export const setFocusedWorkItemAction = ({ get, props, store }) => {
  const queue = get(state[props.queueType]).map(item => {
    if (item.uiKey === props.uiKey) {
      item.isFocused = !item.isFocused;
    }
    return item;
  });
  store.set(state[props.queueType], queue);
};
