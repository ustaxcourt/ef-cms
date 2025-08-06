import { Case } from '@shared/business/entities/cases/Case';
import { RecentFiling } from '@shared/business/entities/RecentFiling';

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
      case 'document':
        comparison = a.document
          .toLowerCase()
          .localeCompare(b.document.toLowerCase());
        break;
      case 'caseTitle':
        comparison = a.caseTitle
          .toLowerCase()
          .localeCompare(b.caseTitle.toLowerCase());
        break;
      default:
        comparison = String(a[sortField] || '')
          .toLowerCase()
          .localeCompare(String(b[sortField] || '').toLowerCase());
    }

    if (comparison === 0 && sortField !== 'filedDate') {
      comparison = b.filedDate.localeCompare(a.filedDate);
    }

    return comparison * multiplier;
  });
}
