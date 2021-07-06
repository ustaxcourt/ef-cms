import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { featureFlagHelper as featureFlagHelperComputed } from './featureFlagHelper';
// import { runCompute } from 'cerebral/test';
// import { withAppContextDecorator } from '../../../withAppContext';

describe('featureFlagHelper', () => {
  // const featureFlagHelper = withAppContextDecorator(featureFlagHelperComputed, {
  //   applicationContext,
  // });

  it('returns isSearchEnabled true when isFeatureEnabled is true', () => {
    applicationContext.isFeatureEnabled.mockReturnValue(true);

    const result = featureFlagHelperComputed(null, applicationContext);
    expect(result).toMatchObject({
      isSearchEnabled: true,
    });
  });

  it('returns isSearchEnabled false when isFeatureEnabled is false', () => {
    applicationContext.isFeatureEnabled.mockReturnValue(false);

    const result = featureFlagHelperComputed(null, applicationContext);
    expect(result).toMatchObject({
      isSearchEnabled: false,
    });
  });
});
