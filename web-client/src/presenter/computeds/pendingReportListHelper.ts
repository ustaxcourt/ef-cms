import { CHIEF_JUDGE } from '@shared/business/entities/EntityConstants';
import { Get } from 'cerebral';
import { formatJudgeName } from '@shared/business/utilities/getFormattedJudgeName';
import { state } from '@web-client/presenter/app.cerebral';

export const pendingReportListHelper = (
  get: Get,
): {
  showNoPendingItems: boolean;
  showSelectJudgeText: boolean;
  judges: string[];
} => {
  const searchResultsCount = get(state.pendingReports.pendingItemsTotal);
  const hasPendingItemsResults = get(
    state.pendingReports.hasPendingItemsResults,
  );
  const judge = get(state.pendingReports.selectedJudge);

  const showSelectJudgeText = !judge;
  const showNoPendingItems =
    searchResultsCount === 0 && !hasPendingItemsResults && !!judge;

  const judges = get(state.judges)
    .map(i => formatJudgeName(i.name))
    .concat(CHIEF_JUDGE)
    .sort();

  return {
    judges,
    showNoPendingItems,
    showSelectJudgeText,
  };
};
