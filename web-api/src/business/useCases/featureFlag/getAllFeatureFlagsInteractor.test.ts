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

  it('uses disabled defaults for invalid initial values and keeps valid flags', async () => {
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
    isolatedPersistenceMock.mockResolvedValueOnce([
      {
        name: FEATURE_FLAG_KEY,
        value: { current: '50' },
      },
      {
        name: ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key,
        value: { current: null },
      },
      {
        name: ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key,
        value: { current: true },
      },
    ]);

    const result = await isolatedInteractor(applicationContext, true);

    expect(result).toMatchObject({
      [FEATURE_FLAG_KEY]: false,
      [ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key]: false,
      [ALLOWLIST_FEATURE_FLAGS.E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key]: true,
    });
    expect(result).toHaveProperty('isValidated', true);
    expect(isolatedPersistenceMock).toHaveBeenCalledTimes(1);
    expect(applicationContext.logger.error).toHaveBeenCalledTimes(2);
    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      'Invalid persisted feature flag value; using fallback',
      { featureFlag: FEATURE_FLAG_KEY },
    );
    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      'Invalid persisted feature flag value; using fallback',
      { featureFlag: ALLOWLIST_FEATURE_FLAGS.RESTRICTED_EVENT_CODES.key },
    );
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

  it('retains the last valid value when a hard reload contains an invalid value', async () => {
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
          value: { current: 50 },
        },
      ])
      .mockResolvedValueOnce([
        {
          name: FEATURE_FLAG_KEY,
          value: { current: '50' },
        },
      ]);

    const initialResult = await isolatedInteractor(applicationContext, true);
    const reloadedResult = await isolatedInteractor(applicationContext, true);

    expect(initialResult).toMatchObject({ [FEATURE_FLAG_KEY]: 50 });
    expect(reloadedResult).toMatchObject({ [FEATURE_FLAG_KEY]: 50 });
    expect(reloadedResult).toHaveProperty('isValidated', true);
    expect(isolatedPersistenceMock).toHaveBeenCalledTimes(2);
    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      'Invalid persisted feature flag value; using fallback',
      { featureFlag: FEATURE_FLAG_KEY },
    );
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
