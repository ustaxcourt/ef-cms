import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';
import { PendingItemFormatted } from '@shared/business/utilities/formatPendingItem';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { sortBy } from 'lodash';
import { Case } from '@shared/business/entities/cases/Case';

type SortedPendingItemFormatted = PendingItemFormatted & {
  sortableDocketNumber: number;
};

type PendingReportHelperResults = {
  printUrl: string;
  pendingItems: SortedPendingItemFormatted[];
};

export const pendingReportHelper = (get: Get): PendingReportHelperResults => {
  const { sortField, sortOrder } = get(
    state[STATE_KEYS.PENDING_REPORT_TABLE_SORT],
  );

  const judgeFilter = get(state.screenMetadata.pendingItemsFilters.judge);
  const queryString = qs.stringify({ judgeFilter });

  const pendingItems = get(state.pendingReports.pendingItems).map(
    pendingItem => {
      const sortedPendingItemFormatted: SortedPendingItemFormatted = {
        ...pendingItem,
        sortableDocketNumber:
          Case.getSortableDocketNumber(pendingItem.docketNumber) || 0,
      };

      return sortedPendingItemFormatted;
    },
  );

  return {
    printUrl: `/reports/pending-report/printable?${queryString}`,
    pendingItems: sortPendingReportTable(pendingItems, sortField, sortOrder),
  };
};

export function sortPendingReportTable(
  pendingItems: SortedPendingItemFormatted[] = [],
  pendingItemSortField: string | undefined,
  pendingItemSortOrder: 'asc' | 'desc' | undefined,
): SortedPendingItemFormatted[] {
  if (!pendingItemSortField || !pendingItemSortOrder) {
    return sortBy(pendingItems, ['receivedAt', 'sortableDocketNumber']);
  }

  const sorttedPendingItems = sortBy(pendingItems, [
    pendingItemSortField,
    'receivedAt',
  ]);

  if (pendingItemSortOrder === 'desc') return sorttedPendingItems.reverse();
  return sorttedPendingItems;
}
