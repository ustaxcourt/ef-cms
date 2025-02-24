import { Case } from '@shared/business/entities/cases/Case';
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
    const SORTABLE_VALUE = getSortableValue(pendingItemSortField, pi);
    return {
      ...pi,
      [KEY]: SORTABLE_VALUE,
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

function getSortableValue(
  sortField: string,
  pendingItem: PendingItemFormatted,
) {
  if (sortField === 'docketNumber')
    return Case.getSortableDocketNumber(pendingItem.docketNumber)!;
  if (typeof pendingItem[sortField] === 'string')
    return pendingItem[sortField].toLocaleLowerCase();

  return pendingItem[sortField];
}
