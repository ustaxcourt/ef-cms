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
  const allowlistFeatures = Object.values(ALLOWLIST_FEATURE_FLAGS);

  for (let i = 0; i < allowlistFeatures.length; i++) {
    if (allowlistFeatures[i].key === featureFlag) {
      return await applicationContext
        .getPersistenceGateway()
        .getFeatureFlagValue({ applicationContext, featureFlag });
    }
  }

  throw new UnauthorizedError(
    `Unauthorized: ${featureFlag} is not included in the allowlist`,
  );
};
