const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getFeatureFlagValueInteractor,
} = require('./getFeatureFlagValueInteractor');
const { ALLOWLIST_FEATURE_FLAGS } = require('../../entities/EntityConstants');

describe('getFeatureFlagValueInteractor', () => {
  it('should return true when the persistence method returns true', async () => {
    applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue.mockResolvedValue(true);

    const result = await getFeatureFlagValueInteractor(applicationContext, {
      featureFlag: ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH,
    });

    expect(result).toBe(true);
  });

  it('should return false when the persistence method returns false', async () => {
    applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue.mockResolvedValue(false);

    const result = await getFeatureFlagValueInteractor(applicationContext, {
      featureFlag: ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH,
    });

    expect(result).toBe(false);
  });

  it.skip('should throw an unauthorized error when the feature flag is not included in the allowlist', async () => {
    const mockFeatureFlagDenied = 'woopsies';

    const result = await getFeatureFlagValueInteractor(applicationContext, {
      featureFlag: mockFeatureFlagDenied,
    });

    await expect(result).rejects.toThrow(
      `Unauthorized: ${mockFeatureFlagDenied} is not included in the allowlist`,
    );
  });
});
