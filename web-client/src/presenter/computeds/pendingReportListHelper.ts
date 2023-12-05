import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const pendingReportListHelper = (
  get: Get,
): {
  showLoadMore: boolean;
  showNoPendingItems: boolean;
  showSelectJudgeText: boolean;
} => {
  const searchResultsCount = get(state.pendingReports.pendingItemsTotal);
  const hasPendingItemsResults = get(
    state.pendingReports.hasPendingItemsResults,
  );
  const judge = get(state.pendingReports.selectedJudge);

  const showLoadMore =
    get(state.pendingReports.pendingItems).length < searchResultsCount;

  const showNoPendingItems = searchResultsCount === 0 && hasPendingItemsResults;
  const showSelectJudgeText = !judge;

  return {
    showLoadMore,
    showNoPendingItems,
    showSelectJudgeText,
  };
};
