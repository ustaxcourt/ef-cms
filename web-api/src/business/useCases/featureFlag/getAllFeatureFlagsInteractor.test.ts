jest.mock('@web-api/persistence/postgres/featureFlag/getFeatureFlagValues');
import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getAllFeatureFlagsInteractor } from '@web-api/business/useCases/featureFlag/getAllFeatureFlagsInteractor';
import { getFeatureFlagValues as getFeatureFlagValuesMock } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

describe('getAllFeatureFlagsInteractor', () => {
  const getFeatureFlagValues = getFeatureFlagValuesMock as jest.Mock;
  beforeEach(() => {
    applicationContext.environment.stage = 'production';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('retries an invalid initial load instead of caching it', async () => {
    jest.resetModules();
    const isolatedInteractorModule =
      await import('@web-api/business/useCases/featureFlag/getAllFeatureFlagsInteractor');
    const isolatedPersistenceModule =
      await import('@web-api/persistence/postgres/featureFlag/getFeatureFlagValues');
    const isolatedInteractor =
      isolatedInteractorModule.getAllFeatureFlagsInteractor;
    const isolatedGetFeatureFlagValues =
      isolatedPersistenceModule.getFeatureFlagValues;
    const FEATURE_FLAG_KEY =
      ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key;
    const isolatedPersistenceMock = jest.mocked(isolatedGetFeatureFlagValues);
    isolatedPersistenceMock
      .mockResolvedValueOnce([
        {
          name: FEATURE_FLAG_KEY,
          value: { current: { privateField: 'invalid-value' } },
        },
      ])
      .mockResolvedValueOnce([
        {
          name: FEATURE_FLAG_KEY,
          value: { current: 50 },
        },
      ]);

    await expect(isolatedInteractor(applicationContext)).rejects.toThrow(
      'FeatureFlagResponseDTO',
    );

    const result = await isolatedInteractor(applicationContext);

    expect(result).toMatchObject({ [FEATURE_FLAG_KEY]: 50 });
    expect(result).toHaveProperty('isValidated', true);
    expect(isolatedPersistenceMock).toHaveBeenCalledTimes(2);
  });

  it('should return the value of the feature flag', async () => {
    const FEATURE_FLAG_KEY =
      ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key;

    getFeatureFlagValues.mockResolvedValueOnce([
      {
        name: FEATURE_FLAG_KEY,
        value: { current: 50 },
      },
    ]);

    const RESULT = await getAllFeatureFlagsInteractor(applicationContext, true);

    expect(RESULT).toMatchObject({
      entityName: 'FeatureFlagResponseDTO',
      [FEATURE_FLAG_KEY]: 50,
    });
    expect(RESULT).toHaveProperty('isValidated', true);

    const getFeatureFlagValuesCalls = getFeatureFlagValues.mock.calls;
    expect(getFeatureFlagValuesCalls.length).toEqual(1);
  });

  it('should return the default value if the feature flag is not set in postgres', async () => {
    const FEATURE_FLAG_KEY =
      ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key;

    getFeatureFlagValues.mockResolvedValueOnce([]);

    const RESULT = await getAllFeatureFlagsInteractor(applicationContext, true);

    expect(RESULT).toMatchObject({
      entityName: 'FeatureFlagResponseDTO',
      [FEATURE_FLAG_KEY]: false,
    });
    expect(RESULT).toHaveProperty('isValidated', true);

    const getFeatureFlagValuesCalls = getFeatureFlagValues.mock.calls;
    expect(getFeatureFlagValuesCalls.length).toEqual(1);
  });

  it('should not call persistence if feature flags already populated', async () => {
    const FEATURE_FLAG_KEY =
      ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key;

    getFeatureFlagValues.mockResolvedValueOnce([
      {
        name: FEATURE_FLAG_KEY,
        value: { current: 50 },
      },
    ]);

    const RESULT1 = await getAllFeatureFlagsInteractor(
      applicationContext,
      true,
    );

    expect(RESULT1).toMatchObject({
      entityName: 'FeatureFlagResponseDTO',
      [FEATURE_FLAG_KEY]: 50,
    });
    expect(RESULT1).toHaveProperty('isValidated', true);

    const RESULT2 = await getAllFeatureFlagsInteractor(applicationContext);

    expect(RESULT2).toMatchObject({
      entityName: 'FeatureFlagResponseDTO',
      [FEATURE_FLAG_KEY]: 50,
    });
    expect(RESULT2).toHaveProperty('isValidated', true);

    const getFeatureFlagValuesCalls = getFeatureFlagValues.mock.calls;
    expect(getFeatureFlagValuesCalls.length).toEqual(1);
  });

  it('rejects invalid persisted feature flag values', async () => {
    const FEATURE_FLAG_KEY =
      ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key;

    getFeatureFlagValues.mockResolvedValueOnce([
      {
        name: FEATURE_FLAG_KEY,
        value: { current: { privateField: 'invalid-value' } },
      },
    ]);

    await expect(
      getAllFeatureFlagsInteractor(applicationContext, true),
    ).rejects.toThrow('FeatureFlagResponseDTO');
  });

  it('rejects feature flags that are not in the persistence allowlist', async () => {
    getFeatureFlagValues.mockResolvedValueOnce([
      {
        name: 'not-an-allowlisted-flag',
        value: { current: true },
      },
    ]);

    await expect(
      getAllFeatureFlagsInteractor(applicationContext, true),
    ).rejects.toThrow(
      'Unexpected feature flag returned from persistence: not-an-allowlisted-flag',
    );
  });

  it('reloads feature flags for the local environment', async () => {
    const FEATURE_FLAG_KEY =
      ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key;
    applicationContext.environment.stage = 'local';
    getFeatureFlagValues.mockResolvedValueOnce([
      {
        name: FEATURE_FLAG_KEY,
        value: { current: 25 },
      },
    ]);

    const RESULT = await getAllFeatureFlagsInteractor(applicationContext);

    expect(RESULT).toMatchObject({
      [FEATURE_FLAG_KEY]: 25,
    });
    expect(getFeatureFlagValues).toHaveBeenCalledTimes(1);
  });
});
