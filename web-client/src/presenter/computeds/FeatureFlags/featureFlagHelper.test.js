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

  describe('isOrderSearchEnabledForRole', () => {
    it('should be true when the user is internal and state.isOrderSearchEnabled is true', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(true);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: { isOrderSearchEnabled: true, user: mockInternalUser },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: true,
      });
    });

    it('should be false when the user is external, state.isOrderSearchEnabled is true, and state.isExternalOrderSearchEnabled is false', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          isExternalOrderSearchEnabled: false,
          isOrderSearchEnabled: true,
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: false,
      });
    });

    it('should be true when the user is external, state.isOrderSearchEnabled is false and state.isExternalOrderSearchEnabled is true', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          isExternalOrderSearchEnabled: true,
          isOrderSearchEnabled: false,
          user: mockExternalUser,
        },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: true,
      });
    });

    it('should be true when the user is public, state.isOrderSearchEnabled is false and state.isExternalOrderSearchEnabled is true', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          isExternalOrderSearchEnabled: true,
          isOrderSearchEnabled: false,
          user: {},
        },
      });

      expect(result).toMatchObject({
        isOrderSearchEnabledForRole: true,
      });
    });

    it('should be false when the user is internal, state.isOrderSearchEnabled is false and state.isExternalOrderSearchEnabled is false', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: {
          isExternalOrderSearchEnabled: false,
          isOrderSearchEnabled: false,
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
