import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { featureFlagHelper as featureFlagHelperComputed } from './featureFlagHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('featureFlagHelper', () => {
  const mockInternalUser = {
    role: ROLES.petitionsClerk,
  };
  const mockExternalUser = {
    role: ROLES.petitioner,
  };

  const { ALLOWLIST_FEATURE_FLAGS } = applicationContext.getConstants();

  describe('isOrderSearchEnabledForRole', () => {
    it('should be true when the user is internal and state.internal-order-search-enabled is true', () => {
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
            [ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH.key]: true,
          },
          user: mockInternalUser,
        },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: true,
      });
    });

    it('should be false when the user is external, state.internal-order-search-enabled is true, and state.external-order-search-enabled is false', () => {
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
            [ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH.key]: true,
            [ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.key]: false,
          },
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: false,
      });
    });

    it('should be true when the user is external, state.internal-order-search-enabled is false and state.external-order-search-enabled is true', () => {
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
            [ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH.key]: false,
            [ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.key]: true,
          },
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: true,
      });
    });

    it('should be true when the user is public, state.internal-order-search-enabled is false and state.external-order-search-enabled is true', () => {
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
            [ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH.key]: false,
            [ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.key]: true,
          },
          user: {},
        },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: true,
      });
    });

    it('should be false when the user is internal, state.internal-order-search-enabled is false and state.external-order-search-enabled is false', () => {
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
            [ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH.key]: false,
            [ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.key]: false,
          },
          user: mockInternalUser,
        },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: false,
      });
    });
  });

  describe('isOpinionSearchEnabled', () => {
    it('should be true when the advanced_opinion_search feature is enabled', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(true);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: { user: mockExternalUser },
      });

      expect(result).toMatchObject({
        isOpinionSearchEnabled: true,
      });
    });

    it('should be false when the advanced_opinion_search feature is NOT enabled', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: { user: mockExternalUser },
      });

      expect(result).toMatchObject({
        isOpinionSearchEnabled: false,
      });
    });
  });
});
