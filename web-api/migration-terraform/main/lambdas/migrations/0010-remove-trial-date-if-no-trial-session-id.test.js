const {
  AUTOMATIC_BLOCKED_REASONS,
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
      query: () => ({
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

  it('should remove trialDate from a case records when the trialDate occurs before November 20, 2020', async () => {
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
        expect.objectContaining({
          pk: 'case|999-99',
          sk: 'case|999-99',
          trialDate: undefined,
        }),
      ]),
    );
  });

  it('should remove automaticBlock from case if the trial date was removed, it was previously automaticBlocked, and there are no deadlines or pending items', async () => {
    const mockBlockedCaseWithTrialDateAndTrialSessionId = {
      ...mockNonBlockedCase,
      automaticBlocked: true,
      automaticBlockedDate: '2019-08-25T05:00:00.000Z',
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
      pk: 'case|999-99',
      sk: 'case|999-99',
      trialDate: '2019-03-01T21:42:29.073Z',
    };

    const items = [mockBlockedCaseWithTrialDateAndTrialSessionId];

    documentClient.query = jest
      .fn()
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [mockBlockedCaseWithTrialDateAndTrialSessionId],
        }),
      })
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [],
        }),
      });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          automaticBlocked: false,
          automaticBlockedDate: undefined,
          automaticBlockedReason: undefined,
          pk: 'case|999-99',
          sk: 'case|999-99',
          trialDate: undefined,
        }),
      ]),
    );
  });

  it('should NOT remove automaticBlock from case if the trial date is past the trial date cutoff and the case has a trialSessionId', async () => {
    const mockBlockedCaseWithTrialDateAndTrialSessionId = {
      ...mockNonBlockedCase,
      automaticBlocked: true,
      automaticBlockedDate: '2019-08-25T05:00:00.000Z',
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
      pk: 'case|999-99',
      sk: 'case|999-99',
      trialDate: '2021-03-01T21:42:29.073Z',
      trialSessionId: '4e3f2516-37cb-47fa-bfe7-3d347019b67b',
    };

    const items = [mockBlockedCaseWithTrialDateAndTrialSessionId];

    documentClient.query = jest
      .fn()
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [mockBlockedCaseWithTrialDateAndTrialSessionId],
        }),
      })
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [],
        }),
      });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          automaticBlocked: true,
          automaticBlockedDate: '2019-08-25T05:00:00.000Z',
          automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
          pk: 'case|999-99',
          sk: 'case|999-99',
          trialDate: '2021-03-01T21:42:29.073Z',
        }),
      ]),
    );
  });

  it('should NOT remove automaticBlock from case if the trial date was removed, it was previously automaticBlocked, and there are deadlines on the case', async () => {
    const mockBlockedCaseWithTrialDateAndTrialSessionId = {
      ...mockNonBlockedCase,
      automaticBlocked: true,
      automaticBlockedDate: '2019-08-25T05:00:00.000Z',
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
      pk: 'case|999-99',
      sk: 'case|999-99',
      trialDate: '2021-03-01T21:42:29.073Z',
    };

    const items = [mockBlockedCaseWithTrialDateAndTrialSessionId];

    documentClient.query = jest
      .fn()
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [mockBlockedCaseWithTrialDateAndTrialSessionId],
        }),
      })
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [
            {
              pk: 'case|999-99',
              sk: 'case-deadline|f2eda468-8631-40df-a5c9-0a97958ac437',
            },
          ],
        }),
      });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          automaticBlocked: true,
          automaticBlockedDate: '2019-08-25T05:00:00.000Z',
          automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
          pk: 'case|999-99',
          sk: 'case|999-99',
          trialDate: undefined,
        }),
      ]),
    );
  });

  it('should NOT remove automaticBlock from case if the trial date was removed, it was previously automaticBlocked, and there are pending items on the case', async () => {
    const mockBlockedCaseWithTrialDateAndTrialSessionId = {
      ...mockNonBlockedCase,
      automaticBlocked: true,
      automaticBlockedDate: '2019-08-25T05:00:00.000Z',
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
      pk: 'case|999-99',
      sk: 'case|999-99',
      trialDate: '2021-03-01T21:42:29.073Z',
    };

    const items = [mockBlockedCaseWithTrialDateAndTrialSessionId];

    documentClient.query = jest
      .fn()
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [
            mockBlockedCaseWithTrialDateAndTrialSessionId,
            {
              archived: false,
              docketEntryId: '83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
              documentType: 'Answer',
              eventCode: 'A',
              filedBy: 'Test Petitioner',
              pending: true,
              pk: 'case|999-99',
              servedAt: '2019-08-25T05:00:00.000Z',
              sk: 'docket-entry|ac5c1521-8f90-47aa-930c-a61f1a018b78',
              userId: '8bbfcd5a-b02b-4983-8e9c-6cc50d3d566c',
            },
          ],
        }),
      })
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [],
        }),
      });

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          automaticBlocked: true,
          automaticBlockedDate: '2019-08-25T05:00:00.000Z',
          automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
          pk: 'case|999-99',
          sk: 'case|999-99',
          trialDate: undefined,
        }),
      ]),
    );
  });
});
