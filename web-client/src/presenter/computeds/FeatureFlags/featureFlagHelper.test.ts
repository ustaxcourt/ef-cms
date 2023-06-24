import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { featureFlagHelper as featureFlagHelperComputed } from './featureFlagHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
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
    it('should be true when the user is internal and internal order search is enabled', () => {
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

    it('should be true when the user is external and external order search is enabled', () => {
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

    it('should be true when the user is public and external order search is enabled', () => {
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

    it('should be false when the user is external, internal order search is enabled, and external order search is disabled', () => {
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

    it('should be false when the user is internal, internal order search is disabled, and external order search is disabled', () => {
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

  describe('isOpinionSearchEnabledForRole', () => {
    it('should be true when the user is internal and internal opinion search is enabled', () => {
      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH.key]: true,
            [ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH.key]: true,
          },
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isOpinionSearchEnabledForRole: true,
      });
    });

    it('should be true when the user is external and external opinion search is enabled', () => {
      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH.key]: false,
            [ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH.key]: true,
          },
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isOpinionSearchEnabledForRole: true,
      });
    });

    it('should be true when the user is public and external opinion search is enabled', () => {
      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH.key]: false,
            [ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH.key]: true,
          },
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isOpinionSearchEnabledForRole: true,
      });
    });

    it('should be false when the user is external, internal opinion search is enabled, and external opinion search is disabled', () => {
      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH.key]: true,
            [ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH.key]: false,
          },
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isOpinionSearchEnabledForRole: false,
      });
    });

    it('should be false when the user is internal, internal opinion search is disabled, and external opinion search is disabled', () => {
      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          featureFlags: {
            [ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH.key]: false,
            [ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH.key]: false,
          },
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isOpinionSearchEnabledForRole: false,
      });
    });
  });
});
