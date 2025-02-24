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

  const KEY = `sortable__${pendingItemSortField}`;
  const SORTABLE_PENDING_ITEMS = pendingItems.map(pi => {
    const isPropertyString = typeof pi[pendingItemSortField] === 'string';
    return {
      ...pi,
      [KEY]: isPropertyString
        ? pi[pendingItemSortField].toLocaleLowerCase()
        : pi[pendingItemSortField],
    };
  });

  const SORTED_PENDING_ITEMS = sortBy(SORTABLE_PENDING_ITEMS, [
    KEY,
    'receivedAt',
  ]);

  const sortedPendingItems = SORTED_PENDING_ITEMS.map(pi => ({
    ...pi,
    [KEY]: undefined,
  }));

  if (pendingItemSortOrder === 'desc') return sortedPendingItems.reverse();
  return sortedPendingItems;
}
