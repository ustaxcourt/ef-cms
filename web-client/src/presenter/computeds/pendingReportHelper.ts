import { Get } from 'cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import qs from 'qs';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import {
  SortedPendingItemFormatted,
  sortPendingReportItems,
} from '@shared/business/utilities/pendingItem/sortPendingReportItems';

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
    pendingItems: sortPendingReportItems(pendingItems, sortField, sortOrder),
  };
};
