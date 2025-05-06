import { applicationContext } from '@shared/business/test/createTestApplicationContext';
jest.mock('@web-api/persistence/postgres/featureFlag/getFeatureFlagValue');
import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';

describe('getAllFeatureFlagsInteractor', () => {
  const FIRST_KEY_IN_DICTIONARY = Object.keys(ALLOWLIST_FEATURE_FLAGS)[0];
  const TEST_FEATURE_FLAG_KEY =
    ALLOWLIST_FEATURE_FLAGS[FIRST_KEY_IN_DICTIONARY].key;

  beforeEach(() => {
    jest.resetModules();
    applicationContext.environment = { stage: 'prod' };
  });

  it('should retrieve the value of the feature flag from persistence when the feature flag is included in the allowlist', async () => {
    const { getAllFeatureFlagsInteractor } = await import(
      './getAllFeatureFlagsInteractor'
    );

    const { getFeatureFlagValues: getFeatureFlagValuesMock } = await import(
      '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue'
    );

    const getFeatureFlagValues = getFeatureFlagValuesMock as jest.Mock;

    const mockFeatureFlagValue = Object.values(ALLOWLIST_FEATURE_FLAGS).map(
      ({ key }) => ({
        name: key,
        value: { current: `${key}__value` },
      }),
    );

    getFeatureFlagValues.mockResolvedValue(mockFeatureFlagValue);

    const result = await getAllFeatureFlagsInteractor(applicationContext);
    const getFeatureFlagValuesCalls = getFeatureFlagValues.mock.calls;
    expect(getFeatureFlagValuesCalls.length).toEqual(1);
    expect(getFeatureFlagValuesCalls[0][0]).toEqual(
      Object.values(ALLOWLIST_FEATURE_FLAGS).map(flag => flag.key),
    );
    expect(result[TEST_FEATURE_FLAG_KEY]).toBe(
      `${TEST_FEATURE_FLAG_KEY}__value`,
    );
  });

  it('should return false if the persistence method returns undefined', async () => {
    const { getAllFeatureFlagsInteractor } = await import(
      './getAllFeatureFlagsInteractor'
    );

    const { getFeatureFlagValues: getFeatureFlagValuesMock } = await import(
      '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue'
    );

    const getFeatureFlagValues = getFeatureFlagValuesMock as jest.Mock;

    const mockFeatureFlagValue = [];
    getFeatureFlagValues.mockResolvedValue(mockFeatureFlagValue);

    const result = await getAllFeatureFlagsInteractor(applicationContext);

    const getFeatureFlagValuesCalls = getFeatureFlagValues.mock.calls;
    expect(getFeatureFlagValuesCalls.length).toEqual(1);
    expect(getFeatureFlagValuesCalls[0][0]).toEqual(
      Object.values(ALLOWLIST_FEATURE_FLAGS).map(flag => flag.key),
    );
    expect(result[TEST_FEATURE_FLAG_KEY]).toBe(false);
  });

  it('should return a string if the feature flag is a string', async () => {
    const { getAllFeatureFlagsInteractor } = await import(
      './getAllFeatureFlagsInteractor'
    );

    const { getFeatureFlagValues: getFeatureFlagValuesMock } = await import(
      '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue'
    );

    const getFeatureFlagValues = getFeatureFlagValuesMock as jest.Mock;

    const mockFeatureFlagValue = Object.values(ALLOWLIST_FEATURE_FLAGS).map(
      ({ key }) => ({
        name: key,
        value: { current: `${key}__value` },
      }),
    );

    getFeatureFlagValues.mockResolvedValue(mockFeatureFlagValue);

    const result = await getAllFeatureFlagsInteractor(applicationContext);

    expect(result[TEST_FEATURE_FLAG_KEY]).toBe(
      `${TEST_FEATURE_FLAG_KEY}__value`,
    );
  });

  it('should cache the feature flag values when they have already been fetched', async () => {
    const { getAllFeatureFlagsInteractor } = await import(
      './getAllFeatureFlagsInteractor'
    );

    const { getFeatureFlagValues: getFeatureFlagValuesMock } = await import(
      '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue'
    );

    const getFeatureFlagValues = getFeatureFlagValuesMock as jest.Mock;
    const mockFeatureFlagValue = Object.values(ALLOWLIST_FEATURE_FLAGS).map(
      ({ key }) => ({
        name: key,
        value: { current: `${key}__value` },
      }),
    );

    getFeatureFlagValues.mockResolvedValue(mockFeatureFlagValue);
    // First call to populate feature flag cache
    await getAllFeatureFlagsInteractor(applicationContext);
    expect(getFeatureFlagValues).toHaveBeenCalled();

    getFeatureFlagValues.mockClear();
    // Second call when feature flags have been cached
    await getAllFeatureFlagsInteractor(applicationContext);
    expect(getFeatureFlagValues).not.toHaveBeenCalled();
  });
});
