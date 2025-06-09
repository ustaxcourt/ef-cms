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
      [FEATURE_FLAG_KEY]: 50,
    });

    const getFeatureFlagValuesCalls = getFeatureFlagValues.mock.calls;
    expect(getFeatureFlagValuesCalls.length).toEqual(1);
  });

  it('should return the default value if the feature flag is not set in postgres', async () => {
    const FEATURE_FLAG_KEY =
      ALLOWLIST_FEATURE_FLAGS.AWS_BATCH_ZIPPER_MINIMUM_COUNT.key;

    getFeatureFlagValues.mockResolvedValueOnce([]);

    const RESULT = await getAllFeatureFlagsInteractor(applicationContext, true);

    expect(RESULT).toMatchObject({
      [FEATURE_FLAG_KEY]: false,
    });

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
      [FEATURE_FLAG_KEY]: 50,
    });

    const RESULT2 = await getAllFeatureFlagsInteractor(applicationContext);

    expect(RESULT2).toMatchObject({
      [FEATURE_FLAG_KEY]: 50,
    });

    const getFeatureFlagValuesCalls = getFeatureFlagValues.mock.calls;
    expect(getFeatureFlagValuesCalls.length).toEqual(1);
  });
});
