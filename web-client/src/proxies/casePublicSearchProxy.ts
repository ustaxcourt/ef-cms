import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const casePublicSearchInteractor = (
  applicationContext: ClientApplicationContext,
  { searchParams },
) => {
  return get({
    applicationContext,
    endpoint: '/public-api/search',
    params: searchParams,
  });
};
