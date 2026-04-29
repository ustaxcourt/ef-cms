import { CaseAdvancedSearchParamsRequestType, CaseSearchResult } from '@web-api/business/useCases/caseAdvancedSearchInteractor';
import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const caseAdvancedSearchInteractor = (
  applicationContext: ClientApplicationContext,
  { searchParams }: { searchParams: CaseAdvancedSearchParamsRequestType },
): Promise<CaseSearchResult[]> => {
  return get({
    applicationContext,
    endpoint: '/cases/search',
    params: searchParams,
  });
};
