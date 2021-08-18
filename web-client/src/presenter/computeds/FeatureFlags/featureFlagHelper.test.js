import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { featureFlagHelper as featureFlagHelperComputed } from './featureFlagHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('featureFlagHelper', () => {
  describe('isSearchEnabled', () => {
    it('returns isSearchEnabled true when the advanced_document_search feature is enabled and state.isOrderSearchEnabled is true', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(true);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: { isOrderSearchEnabled: true },
      });

      expect(result).toMatchObject({
        isSearchEnabled: true,
      });
    });

    it('returns isSearchEnabled false when the advanced_document_search is NOT enabled and state.isOrderSearchEnabled is true', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: { isOrderSearchEnabled: true },
      });

      expect(result).toMatchObject({
        isSearchEnabled: false,
      });
    });

    it('returns isSearchEnabled false when the advanced_document_search is NOT enabled and state.isOrderSearchEnabled is false', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      const result = runCompute(featureFlagHelper, {
        state: { isOrderSearchEnabled: false },
      });

      expect(result).toMatchObject({
        isSearchEnabled: false,
      });
    });
  });
});
