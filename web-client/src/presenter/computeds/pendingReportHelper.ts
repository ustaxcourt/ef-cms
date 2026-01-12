import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { sortPendingReportItems } from '@shared/business/utilities/pendingItem/sortPendingReportItems';
import { PendingItemFormatted } from '@shared/business/utilities/formatPendingItem';

type PendingReportHelperResults = {
  printUrl: string;
  pendingItems: PendingItemFormatted[];
};

export const pendingReportHelper = (get: Get): PendingReportHelperResults => {
  const { sortField, sortOrder } = get(
    state[STATE_KEYS.PENDING_REPORT_TABLE_SORT],
  );

  const judgeFilter = get(state.screenMetadata.pendingItemsFilters.judge);
  const queryString = qs.stringify({ judgeFilter, sortField, sortOrder });
  const pendingItems = get(state.pendingReports.pendingItems);

  return {
    printUrl: `/reports/pending-report/printable?${queryString}`,
    pendingItems: sortPendingReportItems(pendingItems, sortField, sortOrder),
  };
};
