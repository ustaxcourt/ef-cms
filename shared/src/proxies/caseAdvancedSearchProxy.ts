import { CaseAdvancedSearchTerms } from '@web-api/persistence/postgres/reports/caseSearch/caseAdvancedSearch';
import { get } from './requests';

export const caseAdvancedSearchInteractor = (
  applicationContext,
  { searchParams }: { searchParams: CaseAdvancedSearchTerms },
) => {
  return get({
    applicationContext,
    endpoint: '/cases/search',
    params: searchParams,
  });
};
