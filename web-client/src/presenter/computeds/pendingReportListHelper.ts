import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';

export const pendingReportListHelper = (
  get: Get,
): {
  showNoPendingItems: boolean;
  showSelectJudgeText: boolean;
} => {
  const searchResultsCount = get(state.pendingReports.pendingItemsTotal);
  const hasPendingItemsResults = get(
    state.pendingReports.hasPendingItemsResults,
  );
  const judge = get(state.pendingReports.selectedJudge);

  const showSelectJudgeText = !judge;
  const showNoPendingItems =
    searchResultsCount === 0 && !hasPendingItemsResults && !!judge;

  return {
    showNoPendingItems,
    showSelectJudgeText,
  };
};
