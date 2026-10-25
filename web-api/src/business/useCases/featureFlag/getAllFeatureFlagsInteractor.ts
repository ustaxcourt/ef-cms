import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  ALLOWLIST_FEATURE_FLAGS,
  type FeatureFlagKeys,
} from '@shared/business/entities/EntityConstants';
import { FeatureFlagResponseDTO } from '@shared/business/dto/system/FeatureFlagResponseDTO';
import type { FeatureFlagResponseData } from '@shared/business/dto/system/FeatureFlagResponseDTO';
import { isEmpty } from 'lodash';
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

export type AllFeatureFlags = FeatureFlagResponseData;
const allFeatureFlags: AllFeatureFlags = {};

const cacheFeatureFlag = <Key extends FeatureFlagKeys>(
  key: Key,
  value: NonNullable<FeatureFlagResponseData[Key]>,
): void => {
  allFeatureFlags[key] = value;
};

export const getAllFeatureFlagsInteractor = async (
  applicationContext: ServerApplicationContext,
  hardReload: boolean = false,
): Promise<FeatureFlagResponseDTO> => {
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
    const candidateData: Record<string, unknown> = {};

    const ALL_FEATURE_FLAGS = await getFeatureFlagValues(allowlistFeatures);
    ALL_FEATURE_FLAGS.forEach(({ name, value }) => {
      const { current } = value;
      const featureFlagKey = allowlistFeatures.find(key => key === name);
      if (!featureFlagKey) {
        throw new Error(
          `Unexpected feature flag returned from persistence: ${name}`,
        );
      }
      candidateData[featureFlagKey] = current;
    });

    allowlistFeatures.forEach(featureFlag => {
      if (candidateData[featureFlag] === undefined) {
        candidateData[featureFlag] = false;
      }
    });

    const candidateResponse = new FeatureFlagResponseDTO(
      candidateData,
    ).validate();

    allowlistFeatures.forEach(featureFlag => {
      cacheFeatureFlag(featureFlag, candidateResponse[featureFlag] ?? false);
    });

    return candidateResponse;
  }

  return new FeatureFlagResponseDTO(allFeatureFlags).validate();
};
