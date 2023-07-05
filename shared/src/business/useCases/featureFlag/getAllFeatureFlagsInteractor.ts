import { ALLOWLIST_FEATURE_FLAGS } from '../../entities/EntityConstants';

/**
 * getAllFeatureFlagsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {string} providers.featureFlag the feature flag to get the value for
 * @returns {boolean} true if result of the persistence method is 'true'; false otherwise
 */
export const getAllFeatureFlagsInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const allowlistFeatures = Object.values(ALLOWLIST_FEATURE_FLAGS).map(
    (flag: any) => flag.key,
  );

  let allFeatureFlags: any = {};
  for (let featureFlagKey of allowlistFeatures) {
    const result = await applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue({ applicationContext, featureFlag: featureFlagKey });

    if (result) {
      if (typeof result.current === 'boolean') {
        allFeatureFlags[featureFlagKey] = !!result.current;
      } else {
        allFeatureFlags[featureFlagKey] = result.current;
      }
    } else {
      allFeatureFlags[featureFlagKey] = false;
    }
  }
  return allFeatureFlags;
};
