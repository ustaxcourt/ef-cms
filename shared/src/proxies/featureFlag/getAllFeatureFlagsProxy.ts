import { get } from '../requests';

/**
 * getAllFeatureFlagsInteractor
 *
 * @param {object} applicationContext the application context\
 * @param {object} providers the providers object
 * @param {string} providers.featureFlag the feature flag
 * @returns {Promise<*>} the promise of the api call
 */
export const getAllFeatureFlagsInteractor = applicationContext => {
  return get({
    applicationContext,
    endpoint: '/feature-flag/',
    params: {},
  });
};
