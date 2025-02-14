import { PendingItemFormatted } from '@shared/business/utilities/formatPendingItem';
import { sortBy } from 'lodash';

export function sortPendingReportItems(
  pendingItems: PendingItemFormatted[] = [],
  pendingItemSortField: string | undefined,
  pendingItemSortOrder: 'asc' | 'desc' | undefined,
): PendingItemFormatted[] {
  if (!pendingItemSortField || !pendingItemSortOrder) {
    return sortBy(pendingItems, ['receivedAt']);
  }

  const sortedPendingItems = sortBy(pendingItems, [
    pendingItemSortField,
    'receivedAt',
  ]);

  if (pendingItemSortOrder === 'desc') return sortedPendingItems.reverse();
  return sortedPendingItems;
}
