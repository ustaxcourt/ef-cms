import { CaseAdvancedSearchParamsRequestType } from '@web-api/business/useCases/caseAdvancedSearchInteractor';
import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const caseAdvancedSearchInteractor = (
  applicationContext: ClientApplicationContext,
  { searchParams }: { searchParams: CaseAdvancedSearchParamsRequestType },
) => {
  return get({
    applicationContext,
    endpoint: '/cases/search',
    params: searchParams,
  });
};
