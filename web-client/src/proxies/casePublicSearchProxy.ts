import { RequestApplicationContext, get } from './requests';

export const casePublicSearchInteractor = (
  applicationContext: RequestApplicationContext,
  { searchParams },
) => {
  return get({
    applicationContext,
    endpoint: '/public-api/search',
    params: searchParams,
  });
};
