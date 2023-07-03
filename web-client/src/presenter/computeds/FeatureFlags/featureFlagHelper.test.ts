import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { featureFlagHelper as featureFlagHelperComputed } from './featureFlagHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../../withAppContext';

describe('featureFlagHelper', () => {
  const mockInternalUser = {
    role: ROLES.petitionsClerk,
  };

  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();

  describe('areMultiDocketablePaperFilingsEnabled', () => {
    it('should be true when the feature flag is enabled', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(true);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.MULTI_DOCKETABLE_PAPER_FILINGS.key]: true,
          },
          user: mockInternalUser,
        },
      });

      expect(result).toMatchObject({
        areMultiDocketablePaperFilingsEnabled: true,
      });
    });

    it('should be false when the feature flag is not enabled', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.MULTI_DOCKETABLE_PAPER_FILINGS.key]: false,
          },
          user: mockInternalUser,
        },
      });

      expect(result).toMatchObject({
        areMultiDocketablePaperFilingsEnabled: false,
      });
    });
  });
});
