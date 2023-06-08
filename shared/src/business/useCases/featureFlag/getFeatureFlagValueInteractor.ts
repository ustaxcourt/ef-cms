import { ALLOWLIST_FEATURE_FLAGS } from '../../entities/EntityConstants';

/**
 * getFeatureFlagValueInteractor
 *
 * @param {object} applicationContext the application context
 * @param {string} providers.featureFlag the feature flag to get the value for
 * @returns {boolean} true if result of the persistence method is 'true'; false otherwise
 */
export const getFeatureFlagValueInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const allowlistFeatures = Object.values(ALLOWLIST_FEATURE_FLAGS).map(
    (flag: any) => flag.key,
  );

  let allFFS: any = {};
  for (let featureFlagKey of allowlistFeatures) {
    const result = await applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue({ applicationContext, featureFlag: featureFlagKey });

    if (result) {
      if (typeof result.current === 'boolean') {
        allFFS[featureFlagKey] = !!result.current;
      } else {
        allFFS[featureFlagKey] = result.current;
      }
    } else {
      allFFS[featureFlagKey] = false;
    }
  }
  return allFFS;
};
