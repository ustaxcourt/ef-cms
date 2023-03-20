const { get } = require('../requests');

/**
 * getFeatureFlagValueProxy
 *
 * @param {object} applicationContext the application context\
 * @param {object} providers the providers object
 * @param {string} providers.featureFlag the feature flag
 * @returns {Promise<*>} the promise of the api call
 */
exports.getFeatureFlagValueInteractor = (
  applicationContext,
  { featureFlag },
) => {
  return get({
    applicationContext,
    endpoint: `/feature-flag/${featureFlag}`,
  });
};
