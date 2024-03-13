import { ALLOWLIST_FEATURE_FLAGS } from '../../entities/EntityConstants';
import { isEmpty } from 'lodash';

const allFeatureFlags = {};

export const getAllFeatureFlagsInteractor = async (
  applicationContext: IApplicationContext,
) => {
  const allowlistFeatures = Object.values(ALLOWLIST_FEATURE_FLAGS).map(
    (flag: any) => flag.key,
  );

  // we use ENV so that we emulate a fresh lambda invocation each time.
  // caching the feature flags locally causes integration tests to fail.
  if (
    isEmpty(allFeatureFlags) ||
    applicationContext.environment.stage === 'local'
  ) {
    await Promise.all(
      allowlistFeatures.map(async featureFlagKey => {
        const result = await applicationContext
          .getPersistenceGateway()
          .getFeatureFlagValue({
            applicationContext,
            featureFlag: featureFlagKey,
          });

        if (result) {
          if (typeof result.current === 'boolean') {
            allFeatureFlags[featureFlagKey] = !!result.current;
          } else {
            allFeatureFlags[featureFlagKey] = result.current;
          }
        } else {
          allFeatureFlags[featureFlagKey] = false;
        }
      }),
    );
  }

  return allFeatureFlags;
};
