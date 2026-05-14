import { RequestApplicationContext, get } from './requests';
import { CaseSearchResult } from '@web-api/business/useCases/caseAdvancedSearchInteractor';

export const casePublicSearchInteractor = (
  applicationContext: RequestApplicationContext,
  { searchParams },
): Promise<{ results: CaseSearchResult[] }> => {
  return get({
    applicationContext,
    endpoint: '/public-api/search',
    params: searchParams,
  });
};
