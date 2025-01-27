import { CaseAdvancedSearchTerms } from '@web-api/persistence/elasticsearch/caseAdvancedSearch';
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
