import { state } from 'cerebral';

export const pendingReportListHelper = get => {
  const searchResultsCount = get(state.pendingReports.pendingItemsTotal);
  const pendingItemsPage = get(state.pendingReports.pendingItemsPage);
  const hasPendingItemsResults = get(
    state.pendingReports.hasPendingItemsResults,
  );
  const showLoadMore =
    (get(state.pendingReports.pendingItems) || []).length < searchResultsCount;

  return {
    hasPendingItemsResults,
    pendingItemsPage,
    searchResultsCount,
    showLoadMore,
  };
};
