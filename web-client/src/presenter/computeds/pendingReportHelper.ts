import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';

export const pendingReportHelper = (
  get: Get,
): {
  printUrl: string;
} => {
  const judgeFilter = get(state.screenMetadata.pendingItemsFilters.judge);
  const queryString = qs.stringify({ judgeFilter });

  return {
    printUrl: `/reports/pending-report/printable?${queryString}`,
  };
};
