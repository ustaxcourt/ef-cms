import { RawPublicCaseSearchResult } from '@shared/business/entities/cases/PublicCaseSearchResult';
import { RequestApplicationContext, get } from './requests';

export const casePublicSearchInteractor = (
  applicationContext: RequestApplicationContext,
  { searchParams },
): Promise<{ results: RawPublicCaseSearchResult[] }> => {
  return get({
    applicationContext,
    endpoint: '/public-api/search',
    params: searchParams,
  });
};
