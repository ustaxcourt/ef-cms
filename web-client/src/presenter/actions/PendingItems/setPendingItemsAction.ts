import { state } from 'cerebral';

/**
 * Sets the pending items property in the state
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting pendingItems
 * @param {object} providers.props the pendingItems to set
 */
export const setPendingItemsAction = ({ get, props, store }: ActionProps) => {
  const pendingItems = get(state.pendingReports.pendingItems) || [];
  store.set(state.pendingReports.pendingItems, [
    ...pendingItems,
    ...props.pendingItems,
  ]);
  store.set(state.pendingReports.hasPendingItemsResults, true);
  store.set(state.pendingReports.pendingItemsTotal, props.total);
};
