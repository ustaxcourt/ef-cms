import { state } from 'cerebral';

/**
 * Increments the pending items page
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object used for setting pendingItems
 * @param {object} providers.props the pendingItems to set
 */
export const incrementPendingItemsPageAction = ({
  get,
  store,
}: ActionProps) => {
  const currentPage = get(state.pendingReports.pendingItemsPage) || 0;
  store.set(state.pendingReports.pendingItemsPage, currentPage + 1);
};
