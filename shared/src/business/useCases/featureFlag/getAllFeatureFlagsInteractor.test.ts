import { applicationContext } from '../../test/createTestApplicationContext';

describe('getAllFeatureFlagsInteractor', () => {
  const mockFeatureFlagKey = 'chief-judge-name';
  beforeEach(() => {
    jest.resetModules();
    applicationContext.environment = { stage: 'prod' };
  });

  it('should retrieve the value of the feature flag from persistence when the feature flag is included in the allowlist', async () => {
    const { getAllFeatureFlagsInteractor } = await import(
      './getAllFeatureFlagsInteractor'
    );
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
    expect(result[mockFeatureFlagKey]).toBe(true);
  });

  it('should return false if the persistence method returns undefined', async () => {
    const { getAllFeatureFlagsInteractor } = await import(
      './getAllFeatureFlagsInteractor'
    );
    const mockFeatureFlagValue = undefined;
    applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue.mockResolvedValue(mockFeatureFlagValue);

    const result = await getAllFeatureFlagsInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().getFeatureFlagValue,
    ).toHaveBeenCalled();
    expect(result[mockFeatureFlagKey]).toBe(false);
  });

  it('should return a string if the feature flag is a string', async () => {
    const { getAllFeatureFlagsInteractor } = await import(
      './getAllFeatureFlagsInteractor'
    );
    const mockFeatureFlagValue = {
      current: 'Judge Kerrigan',
    };

    applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue.mockResolvedValue(mockFeatureFlagValue);

    const result = await getAllFeatureFlagsInteractor(applicationContext);

    expect(result[mockFeatureFlagKey]).toBe(mockFeatureFlagValue.current);
  });

  it('should cache the feature flag values when they have already been fetched', async () => {
    const { getAllFeatureFlagsInteractor } = await import(
      './getAllFeatureFlagsInteractor'
    );
    const mockFeatureFlagValue = {
      current: true,
    };
    applicationContext
      .getPersistenceGateway()
      .getFeatureFlagValue.mockResolvedValue(mockFeatureFlagValue);
    // First call to populate feature flag cache
    await getAllFeatureFlagsInteractor(applicationContext);
    expect(
      applicationContext.getPersistenceGateway().getFeatureFlagValue,
    ).toHaveBeenCalled();

    (
      applicationContext.getPersistenceGateway()
        .getFeatureFlagValue as jest.Mock
    ).mockClear();
    // Second call when feature flags have been cached
    await getAllFeatureFlagsInteractor(applicationContext);
    expect(
      applicationContext.getPersistenceGateway().getFeatureFlagValue,
    ).not.toHaveBeenCalled();
  });
});
