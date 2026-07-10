jest.mock('@web-api/persistence/postgres/featureFlag/getFeatureFlagValues');
import { CLERK_OF_THE_COURT_CONFIGURATION } from '@shared/business/entities/EntityConstants';
import {
  getClerkOfTheCourtInfo,
  getFeatureFlagValue,
} from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValue';
import { getFeatureFlagValues as getFeatureFlagValuesMock } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';

describe('getFeatureFlagValue', () => {
  const getFeatureFlagValues = jest.mocked(getFeatureFlagValuesMock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the flag's current value when the flag exists", async () => {
    getFeatureFlagValues.mockResolvedValue([
      { name: 'a-flag', value: { current: 42 } },
    ]);

    const result = await getFeatureFlagValue<number>('a-flag');

    expect(getFeatureFlagValues).toHaveBeenCalledWith(['a-flag']);
    expect(result).toBe(42);
  });

  it('returns undefined when the flag does not exist', async () => {
    getFeatureFlagValues.mockResolvedValue([]);

    const result = await getFeatureFlagValue<number>('missing-flag');

    expect(result).toBeUndefined();
  });
});

describe('getClerkOfTheCourtInfo', () => {
  const getFeatureFlagValues = jest.mocked(getFeatureFlagValuesMock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the clerk name and title from the clerk-of-court-configuration flag', async () => {
    getFeatureFlagValues.mockResolvedValue([
      {
        name: CLERK_OF_THE_COURT_CONFIGURATION,
        value: {
          current: {
            name: 'Clerk Name',
            title: 'Clerk of the Court',
          },
        },
      },
    ]);

    const result = await getClerkOfTheCourtInfo();

    expect(getFeatureFlagValues).toHaveBeenCalledWith([
      CLERK_OF_THE_COURT_CONFIGURATION,
    ]);
    expect(result).toEqual({
      name: 'Clerk Name',
      title: 'Clerk of the Court',
    });
  });

  it('throws when the clerk-of-court-configuration flag is not found', async () => {
    getFeatureFlagValues.mockResolvedValue([]);

    await expect(getClerkOfTheCourtInfo()).rejects.toThrow(
      'Clerk of the court configuration not found',
    );
  });
});
