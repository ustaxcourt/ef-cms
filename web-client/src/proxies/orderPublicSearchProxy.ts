import { RequestApplicationContext, get } from './requests';

export const orderPublicSearchInteractor = (
  applicationContext: RequestApplicationContext,
  { searchParams },
) => {
  return get({
    applicationContext,
    endpoint: '/public-api/order-search',
    params: searchParams,
  });
};
