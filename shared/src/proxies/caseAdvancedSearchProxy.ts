import { CaseAdvancedSearchParamsRequestType } from '@shared/business/useCases/caseAdvancedSearchInteractor';
import { get } from './requests';

export const caseAdvancedSearchInteractor = (
  applicationContext,
  { searchParams }: { searchParams: CaseAdvancedSearchParamsRequestType },
) => {
  return get({
    applicationContext,
    endpoint: '/cases/search',
    params: searchParams,
  });
};
