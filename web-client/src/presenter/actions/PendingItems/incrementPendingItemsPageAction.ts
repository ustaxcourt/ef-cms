import { state } from '@web-client/presenter/app.cerebral';

export const incrementPendingItemsPageAction = ({
  get,
  store,
}: ActionProps) => {
  const currentPage = get(state.pendingReports.pendingItemsPage);
  store.set(state.pendingReports.pendingItemsPage, currentPage + 1);
};
