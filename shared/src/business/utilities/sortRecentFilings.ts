import { Case } from '@shared/business/entities/cases/Case';
import { RecentFiling } from '@shared/business/useCases/getRecentFilingsForUserInteractor';

type SortableField = keyof Pick<
  RecentFiling,
  'docketNumber' | 'filedDate' | 'document' | 'caseTitle'
>;

export function sortRecentFilings(
  recentFilings: RecentFiling[],
  sortField: SortableField = 'filedDate',
  sortOrder: 'asc' | 'desc' = 'desc',
): RecentFiling[] {
  const filings = [...(recentFilings || [])];

  const validSortFields: SortableField[] = [
    'docketNumber',
    'filedDate',
    'document',
    'caseTitle',
  ];
  const validSortOrders = ['asc', 'desc'];

  if (!validSortFields.includes(sortField as SortableField)) {
    sortField = 'filedDate';
  }

  if (!validSortOrders.includes(sortOrder)) {
    sortOrder = 'desc';
  }

  if (sortField === 'filedDate' && sortOrder === 'desc') {
    return filings.sort((a, b) => b.filedDate.localeCompare(a.filedDate));
  }

  return filings.sort((a, b) => {
    let comparison = 0;
    const multiplier = sortOrder === 'desc' ? -1 : 1;

    switch (sortField) {
      case 'docketNumber': {
        const aDocket = Case.getSortableDocketNumber(a.docketNumber);
        const bDocket = Case.getSortableDocketNumber(b.docketNumber);
        if (aDocket != null && bDocket != null) {
          comparison = aDocket - bDocket;
        } else {
          comparison = a.docketNumber.localeCompare(b.docketNumber);
        }
        break;
      }
      case 'filedDate':
        comparison = a.filedDate.localeCompare(b.filedDate);
        break;
      case 'document': {
        const aDoc = a.document || '';
        const bDoc = b.document || '';
        if (a.document === null && b.document !== null) {
          comparison = 1;
        } else if (a.document !== null && b.document === null) {
          comparison = -1;
        } else {
          comparison = aDoc.toLowerCase().localeCompare(bDoc.toLowerCase());
        }
        break;
      }
      case 'caseTitle':
        comparison = a.caseTitle
          .toLowerCase()
          .localeCompare(b.caseTitle.toLowerCase());
        break;
    }

    if (comparison === 0 && sortField !== 'filedDate') {
      comparison = b.filedDate.localeCompare(a.filedDate);
    }

    return comparison * multiplier;
  });
}
