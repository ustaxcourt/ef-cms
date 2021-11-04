/**
 * getFeatureFlagValueInteractor
 *
 * @param {object} applicationContext the application context
 * @param {string} providers.featureFlag the feature flag to get the value for
 * @returns {boolean} true if result of the persistence method is 'true'; false otherwise
 */

exports.getFeatureFlagValueInteractor = async (
  applicationContext,
  { featureFlag },
) => {
  return await applicationContext
    .getPersistenceGateway()
    .getFeatureFlagValue({ applicationContext, featureFlag });
};
