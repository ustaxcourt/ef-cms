import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const orderPublicSearchInteractor = (
  applicationContext: ClientApplicationContext,
  { searchParams },
) => {
  return get({
    applicationContext,
    endpoint: '/public-api/order-search',
    params: searchParams,
  });
};
