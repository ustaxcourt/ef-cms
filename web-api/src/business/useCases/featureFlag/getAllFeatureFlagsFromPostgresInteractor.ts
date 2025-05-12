import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  ALLOWLIST_FEATURE_FLAGS_POSTGRES,
  PostgresFeatureFlagKeys,
} from '@shared/business/entities/EntityConstants';
import { isEmpty } from 'lodash';
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

type AllFeatureFlags = Partial<{ [K in PostgresFeatureFlagKeys]: any }>;
const allFeatureFlags: AllFeatureFlags = {};

export const getAllFeatureFlagsFromPostgresInteractor = async (
  applicationContext: ServerApplicationContext,
  hardReload: boolean = false,
): Promise<AllFeatureFlags> => {
  const allowlistFeatures = Object.values(ALLOWLIST_FEATURE_FLAGS_POSTGRES).map(
    flag => flag.key,
  );

  // we use ENV so that we emulate a fresh lambda invocation each time.
  // caching the feature flags locally causes integration tests to fail.
  if (
    hardReload ||
    isEmpty(allFeatureFlags) ||
    applicationContext.environment.stage === 'local'
  ) {
    Object.keys(allFeatureFlags).forEach(
      ffKey => delete allFeatureFlags[ffKey],
    );

    const ALL_FEATURE_FLAGS = await getFeatureFlagValues(allowlistFeatures);
    ALL_FEATURE_FLAGS.forEach(({ name, value }) => {
      const { current } = value;
      allFeatureFlags[name] = current;
    });

    allowlistFeatures.forEach(featureFlag => {
      if (allFeatureFlags[featureFlag] === undefined)
        allFeatureFlags[featureFlag] = false;
    });
  }

  return allFeatureFlags;
};
