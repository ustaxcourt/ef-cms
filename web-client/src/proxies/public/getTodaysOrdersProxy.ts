import { get } from '../requests';
import { ClientApplicationContext } from '@web-client/applicationContext';

export const getTodaysOrdersInteractor = (
  applicationContext: ClientApplicationContext,
  { page, todaysOrdersSort },
) => {
  return get({
    applicationContext,
    endpoint: `/public-api/todays-orders/${page}/${todaysOrdersSort}`,
  });
};
