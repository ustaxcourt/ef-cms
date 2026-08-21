import { Case } from '@shared/business/entities/cases/Case';
import { RecentFiling } from '@shared/business/useCases/getRecentFilingsForUserInteractor';

type SortableField = keyof Pick<
  RecentFiling,
  'docketNumber' | 'filedDate' | 'document' | 'caseTitle' | 'status'
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
    'status',
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
    const direction = sortOrder === 'desc' ? -1 : 1;

    switch (sortField) {
      case 'docketNumber': {
        comparison = Case.docketNumberSort(a.docketNumber, b.docketNumber);
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
      case 'status': {
        const formattedStatusA = Case.formatCaseStatus({
          caseStatus: a.status,
          trialDate: a.trialDate,
          trialLocation: a.trialLocation,
        });
        const formattedStatusB = Case.formatCaseStatus({
          caseStatus: b.status,
          trialDate: b.trialDate,
          trialLocation: b.trialLocation,
        });
        comparison = formattedStatusA.localeCompare(formattedStatusB);
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

    return comparison * direction;
  });
}
