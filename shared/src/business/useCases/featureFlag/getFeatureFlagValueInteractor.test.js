const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getFeatureFlagValueInteractor,
} = require('./getFeatureFlagValueInteractor');
const { ALLOWLIST_FEATURE_FLAGS } = require('../../entities/EntityConstants');

describe('getFeatureFlagValueInteractor', () => {
  it('should retrieve the value of the feature flag from persistence when the feature flag is included in the allowlist', async () => {
    const mockFeatureFlagValue = true;
    applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue.mockResolvedValue(mockFeatureFlagValue);

    const result = await getFeatureFlagValueInteractor(applicationContext, {
      featureFlag: ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.key,
    });

    expect(
      applicationContext.getPersistenceGateway().getFeatureFlagValue,
    ).toHaveBeenCalled();
    expect(result).toBe(mockFeatureFlagValue);
  });

  it('should throw an unauthorized error when the feature flag is not included in the allowlist', async () => {
    const mockFeatureFlagDenied = 'woopsies';

    await expect(
      getFeatureFlagValueInteractor(applicationContext, {
        featureFlag: mockFeatureFlagDenied,
      }),
    ).rejects.toThrow(
      `Unauthorized: ${mockFeatureFlagDenied} is not included in the allowlist`,
    );
  });
});
