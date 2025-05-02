import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  ALLOWLIST_FEATURE_FLAGS,
  FeatureFlagKeys,
} from '@shared/business/entities/EntityConstants';
import { isEmpty } from 'lodash';
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue';

type AllFeatureFlags = Partial<{ [K in FeatureFlagKeys]: any }>;
const allFeatureFlags: AllFeatureFlags = {};

export const getAllFeatureFlagsInteractor = async (
  applicationContext: ServerApplicationContext,
  hardReload: boolean = false,
): Promise<AllFeatureFlags> => {
  const allowlistFeatures = Object.values(ALLOWLIST_FEATURE_FLAGS).map(
    flag => flag.key,
  );

  // we use ENV so that we emulate a fresh lambda invocation each time.
  // caching the feature flags locally causes integration tests to fail.
  if (
    hardReload ||
    isEmpty(allFeatureFlags) ||
    applicationContext.environment.stage === 'local'
  ) {
    const ALL_FEATURE_FLAGS = await getFeatureFlagValues(allowlistFeatures);
    ALL_FEATURE_FLAGS.forEach(({ name, value }) => {
      const { current } = JSON.parse(value) as { current: any };
      allFeatureFlags[name] = current;
    });
  }

  return allFeatureFlags;
};
