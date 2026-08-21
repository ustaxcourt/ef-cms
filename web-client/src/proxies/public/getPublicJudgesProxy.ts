import { get } from '../requests';

export const getPublicJudgesInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/public-api/judges',
  });
};
