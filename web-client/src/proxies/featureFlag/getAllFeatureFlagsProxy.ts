import { get } from '../requests';

export const getAllFeatureFlagsInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/system/feature-flag/',
    params: {},
  });
};
