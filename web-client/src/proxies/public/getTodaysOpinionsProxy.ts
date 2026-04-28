import { get } from '../requests';

export const getTodaysOpinionsInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/public-api/todays-opinions',
  });
};
