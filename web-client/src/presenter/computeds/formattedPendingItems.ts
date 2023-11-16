import { Get } from 'cerebral';
import { PendingItemFormatted } from '@shared/business/utilities/formatPendingItem';
import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';

export const formattedPendingItemsHelper = (
  get: Get,
  applicationContext: IApplicationContext,
): {
  printUrl: string;
  judges: string[];
  items: PendingItemFormatted[];
} => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  const items = get(state.pendingReports.pendingItems).map(item =>
    applicationContext
      .getUtilities()
      .formatPendingItem(item, { applicationContext }),
  );
  const judgeFilter = get(state.screenMetadata.pendingItemsFilters.judge);
  const judges = get(state.judges)
    .map(i => applicationContext.getUtilities().formatJudgeName(i.name))
    .concat(CHIEF_JUDGE)
    .sort();

  const queryString = qs.stringify({ judgeFilter });

  return {
    items,
    judges,
    printUrl: `/reports/pending-report/printable?${queryString}`,
  };
};
