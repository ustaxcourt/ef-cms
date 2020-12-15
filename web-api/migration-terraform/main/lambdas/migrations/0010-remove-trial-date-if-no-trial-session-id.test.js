const {
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  PROCEDURE_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  migrateItems,
} = require('./0010-remove-trial-date-if-no-trial-session-id');

describe('migrateItems', () => {
  let documentClient;

  const mockUserId = 'a21f3ea9-0f94-4b9c-bc39-98e1ab539b44';

  // we are defining a case as opposed to using MOCK_CASE as we are trying to represent the case
  // item being checked in the migration script, NOT a full case record
  const mockNonBlockedCase = {
    caseCaption: 'A caption',
    caseType: CASE_TYPES_MAP.deficiency,
    contactPrimary: {
      address1: '876 12th Ave',
      city: 'Nashville',
      contactId: mockUserId,
      countryType: COUNTRY_TYPES.DOMESTIC,
      name: 'Jimmy Dean',
      phone: '1234567890',
      postalCode: '05198',
      secondaryName: 'Jimmy Dean',
      state: 'AK',
    },
    docketNumber: '999-99',
    partyType: PARTY_TYPES.petitioner,
    pk: 'case|999-99',
    procedureType: PROCEDURE_TYPES[0],
    sk: 'case|999-99',
    sortableDocketNumber: 999,
    trialDate: '2019-03-01T21:42:29.073Z',
    userId: mockUserId,
  };

  beforeEach(() => {
    documentClient = {
      get: () => ({
        promise: async () => ({
          Items: [],
        }),
      }),
    };
  });

  it('should return and not modify records that are NOT case records', async () => {
    const items = [
      {
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
          sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        },
      ]),
    );
  });

  it('should return and not modify case records that do not have a trial date', async () => {
    const mockNonBlockedCaseWithoutTrialDate = {
      pk: 'case|999-99',
      sk: 'case|999-99',
    };

    const items = [mockNonBlockedCaseWithoutTrialDate];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining(mockNonBlockedCaseWithoutTrialDate),
      ]),
    );
  });

  it('should return and not modify case records that have a trial date and a trialSessionId', async () => {
    const mockTrialSessionId = '2129e02c-4122-4368-a888-b3b18196c687';
    const mockNonBlockedCaseWithTrialDateAndTrialSessionId = {
      ...mockNonBlockedCase,
      pk: 'case|999-99',
      sk: 'case|999-99',
      trialDate: '2019-03-01T21:42:29.073Z',
      trialSessionId: mockTrialSessionId,
    };

    const items = [mockNonBlockedCaseWithTrialDateAndTrialSessionId];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining(
          mockNonBlockedCaseWithTrialDateAndTrialSessionId,
        ),
      ]),
    );
  });

  it('should remove trialDate from case records that have a trialDate and no trialSessionId', async () => {
    const items = [mockNonBlockedCase];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          pk: 'case|999-99',
          sk: 'case|999-99',
          trialDate: undefined,
        }),
      ]),
    );
  });

  it('should remove trialDate from a case records when the trialDate occurs before November 20, 2020', async () => {});
});
