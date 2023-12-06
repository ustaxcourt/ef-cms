import { state } from '@web-client/presenter/app.cerebral';

/**
 * invokes the path in the sequences depending on if work item should be marked read
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which is contains the next paths that can be invoked
 * @param {object} providers.props the cerebral props object used for getting the props.markWorkItemRead
 * @param {object} providers.store the cerebral store used for setting state.workItem
 * @returns {object} continue path for the sequence
 */
export const getShouldMarkReadAction = ({
  path,
  props,
  store,
}: ActionProps) => {
  const { workItemIdToMarkAsRead } = props;
  if (workItemIdToMarkAsRead) {
    store.set(state.workItemId, props.workItemIdToMarkAsRead);
    return path['markRead']();
  } else {
    return path['noAction']();
  }
};
