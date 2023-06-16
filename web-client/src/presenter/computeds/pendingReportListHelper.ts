import { state } from '@web-client/presenter/app.cerebral';

import { Get } from 'cerebral';
export const pendingReportListHelper = (get: Get) => {
  const searchResultsCount = get(state.pendingReports.pendingItemsTotal);
  const pendingItemsPage = get(state.pendingReports.pendingItemsPage);
  const hasPendingItemsResults = get(
    state.pendingReports.hasPendingItemsResults,
  );
  const judge = get(state.pendingReports.selectedJudge);

  const showLoadMore =
    (get(state.pendingReports.pendingItems) || []).length < searchResultsCount;

  const showNoPendingItems = searchResultsCount === 0;
  const showSelectJudgeText = !judge;

  return {
    hasPendingItemsResults,
    pendingItemsPage,
    searchResultsCount,
    showLoadMore,
    showNoPendingItems,
    showSelectJudgeText,
  };
};
