import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { featureFlagHelper as featureFlagHelperComputed } from './featureFlagHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../../withAppContext';

describe('featureFlagHelper', () => {
  describe('isSearchEnabled', () => {
    it('returns isSearchEnabled true when the advanced_document_search feature is enabled', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(true);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      expect(runCompute(featureFlagHelper, {})).toMatchObject({
        isSearchEnabled: true,
      });
    });

    it('returns isSearchEnabled false when the advanced_document_search is NOT enabled', () => {
      applicationContext.isFeatureEnabled.mockReturnValue(false);

      const featureFlagHelper = withAppContextDecorator(
        featureFlagHelperComputed,
        {
          ...applicationContext,
        },
      );

      expect(runCompute(featureFlagHelper, {})).toMatchObject({
        isSearchEnabled: false,
      });
    });
  });
});
