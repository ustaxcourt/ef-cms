const { ALLOWLIST_FEATURE_FLAGS } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

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
  const allowlistFeatures = Object.values(ALLOWLIST_FEATURE_FLAGS).map(
    flag => flag.key,
  );

  if (!allowlistFeatures.includes(featureFlag)) {
    throw new UnauthorizedError(
      `Unauthorized: ${featureFlag} is not included in the allowlist`,
    );
  }

  const result = await applicationContext
    .getPersistenceGateway()
    .getFeatureFlagValue({ applicationContext, featureFlag });

  return !!(result && result.current);
};
