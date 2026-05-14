import { RequestApplicationContext, get } from '../requests';

export const getTodaysOrdersInteractor = (
  applicationContext: RequestApplicationContext,
  { page, todaysOrdersSort },
) => {
  return get({
    applicationContext,
    endpoint: `/public-api/todays-orders/${page}/${todaysOrdersSort}`,
  });
};
