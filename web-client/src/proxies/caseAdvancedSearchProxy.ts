import { CaseAdvancedSearchParamsRequestType } from '@web-api/business/useCases/caseAdvancedSearchInteractor';
import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';
import { RawPublicCaseSearchResult } from '@shared/business/entities/cases/PublicCaseSearchResult';

export const caseAdvancedSearchInteractor = (
  applicationContext: ClientApplicationContext,
  { searchParams }: { searchParams: CaseAdvancedSearchParamsRequestType },
): Promise<RawPublicCaseSearchResult[]> => {
  return get({
    applicationContext,
    endpoint: '/cases/search',
    params: searchParams,
  });
};
