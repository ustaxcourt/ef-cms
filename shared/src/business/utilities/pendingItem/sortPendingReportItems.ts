import { Case } from '@shared/business/entities/cases/Case';
import { PendingItemFormatted } from '@shared/business/utilities/formatPendingItem';

export function sortPendingReportItems(
  _pendingItems: PendingItemFormatted[] = [],
  pendingItemSortField: string | undefined,
  pendingItemSortOrder: 'asc' | 'desc' | undefined,
): PendingItemFormatted[] {
  const pendingItems = [..._pendingItems];

  if (!pendingItemSortField || !pendingItemSortOrder) {
    return pendingItems.sort((a, b) =>
      a.receivedAt.localeCompare(b.receivedAt),
    );
  }

  const sortedPendingItems = pendingItems.sort((a, b) => {
    if (pendingItemSortField === 'docketNumber') {
      const aDocket = Case.getSortableDocketNumber(a.docketNumber)!;
      const bDocket = Case.getSortableDocketNumber(b.docketNumber)!;
      if (aDocket !== bDocket) return aDocket < bDocket ? -1 : 1;
      return a.receivedAt.localeCompare(b.receivedAt);
    }

    if (typeof a[pendingItemSortField] === 'string') {
      const aValue = a[pendingItemSortField].toLocaleLowerCase();
      const bValue = b[pendingItemSortField].toLocaleLowerCase();
      if (aValue !== bValue) return aValue < bValue ? -1 : 1;
      return a.receivedAt.localeCompare(b.receivedAt);
    }

    const aValue = a[pendingItemSortField];
    const bValue = b[pendingItemSortField];
    if (aValue !== bValue) return aValue < bValue ? -1 : 1;
    return a.receivedAt.localeCompare(b.receivedAt);
  });

  return pendingItemSortOrder === 'desc'
    ? sortedPendingItems.reverse()
    : sortedPendingItems;
}
