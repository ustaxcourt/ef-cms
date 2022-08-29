import { ALLOWLIST_FEATURE_FLAGS } from '../../entities/EntityConstants';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * getFeatureFlagValueInteractor
 *
 * @param {object} applicationContext the application context
 * @param {string} providers.featureFlag the feature flag to get the value for
 * @returns {boolean} true if result of the persistence method is 'true'; false otherwise
 */
export const getFeatureFlagValueInteractor = async (
  applicationContext: IApplicationContext,
  { featureFlag }: { featureFlag: string },
) => {
  const allowlistFeatures = Object.values(ALLOWLIST_FEATURE_FLAGS).map(
    (flag: any) => flag.key,
  );

  if (!allowlistFeatures.includes(featureFlag)) {
    throw new UnauthorizedError(
      `Unauthorized: ${featureFlag} is not included in the allowlist`,
    );
  }

  const result = await applicationContext
    .getPersistenceGateway()
    .getFeatureFlagValue({ applicationContext, featureFlag });

  if (result) {
    if (typeof result.current === 'boolean') {
      return !!result.current;
    } else {
      return result.current;
    }
  } else {
    return false;
  }
};
