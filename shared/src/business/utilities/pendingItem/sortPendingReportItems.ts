import { PendingItemFormatted } from '@shared/business/utilities/formatPendingItem';
import { sortBy } from 'lodash';

export type SortedPendingItemFormatted = PendingItemFormatted & {
  sortableDocketNumber: number;
};

export function sortPendingReportItems(
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
