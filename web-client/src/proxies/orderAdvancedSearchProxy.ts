import { get } from './requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const orderAdvancedSearchInteractor = (
  applicationContext: ClientApplicationContext,
  { searchParams },
) => {
  return get({
    applicationContext,
    endpoint: '/case-documents/order-search',
    params: searchParams,
  });
};
