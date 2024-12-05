import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';

export const formattedPendingItemsHelper = (
  get: Get,
  applicationContext: IApplicationContext,
): {
  printUrl: string;
  judges: string[];
} => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  const judgeFilter = get(state.screenMetadata.pendingItemsFilters.judge);
  const judges = get(state.judges)
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat(CHIEF_JUDGE)
    .sort();

  const queryString = qs.stringify({ judgeFilter });

  return {
    judges,
    printUrl: `/reports/pending-report/printable?${queryString}`,
  };
};
