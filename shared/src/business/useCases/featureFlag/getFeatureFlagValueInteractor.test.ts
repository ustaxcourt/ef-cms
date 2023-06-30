import { ALLOWLIST_FEATURE_FLAGS } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getFeatureFlagValueInteractor } from './getFeatureFlagValueInteractor';

describe('getFeatureFlagValueInteractor', () => {
  it('should retrieve the value of the feature flag from persistence when the feature flag is included in the allowlist', async () => {
    const mockFeatureFlagValue = {
      current: true,
    };
    applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue.mockResolvedValue(mockFeatureFlagValue);

    const result = await getFeatureFlagValueInteractor(applicationContext, {
      featureFlag: ALLOWLIST_FEATURE_FLAGS.USE_EXTERNAL_PDF_GENERATION.key,
    });

    expect(
      applicationContext.getPersistenceGateway().getFeatureFlagValue,
    ).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false if the persistence method returns undefined', async () => {
    const mockFeatureFlagValue = undefined;
    applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue.mockResolvedValue(mockFeatureFlagValue);

    const result = await getFeatureFlagValueInteractor(applicationContext, {
      featureFlag: ALLOWLIST_FEATURE_FLAGS.USE_EXTERNAL_PDF_GENERATION.key,
    });

    expect(
      applicationContext.getPersistenceGateway().getFeatureFlagValue,
    ).toHaveBeenCalled();
    expect(result).toBe(false);
  });

  it('should return a string if the feature flag is a string', async () => {
    const mockFeatureFlagValue = {
      current: 'Judge Kerrigan',
    };

    applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue.mockResolvedValue(mockFeatureFlagValue);

    const result = await getFeatureFlagValueInteractor(applicationContext, {
      featureFlag: ALLOWLIST_FEATURE_FLAGS.CHIEF_JUDGE_NAME.key,
    });

    expect(result).toBe(mockFeatureFlagValue.current);
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
