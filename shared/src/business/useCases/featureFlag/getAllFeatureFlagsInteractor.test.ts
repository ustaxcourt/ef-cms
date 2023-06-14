import { applicationContext } from '../../test/createTestApplicationContext';
import { getAllFeatureFlagsInteractor } from './getAllFeatureFlagsInteractor';

describe('getAllFeatureFlagsInteractor', () => {
  it('should retrieve the value of the feature flag from persistence when the feature flag is included in the allowlist', async () => {
    const mockFeatureFlagValue = {
      current: true,
    };
    applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue.mockResolvedValue(mockFeatureFlagValue);

    const result = await getAllFeatureFlagsInteractor(applicationContext);

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

    const result = await getAllFeatureFlagsInteractor(applicationContext);

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

    const result = await getAllFeatureFlagsInteractor(applicationContext);

    expect(result).toBe(mockFeatureFlagValue.current);
  });

  it('should throw an unauthorized error when the feature flag is not included in the allowlist', async () => {
    const mockFeatureFlagDenied = 'woopsies';

    await expect(
      getAllFeatureFlagsInteractor(applicationContext),
    ).rejects.toThrow(
      `Unauthorized: ${mockFeatureFlagDenied} is not included in the allowlist`,
    );
  });
});
