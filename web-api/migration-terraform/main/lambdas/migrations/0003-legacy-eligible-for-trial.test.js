const {
  CASE_STATUS_TYPES,
  ROLES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0003-legacy-eligible-for-trial');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let documentClient;

  const mockCaseRecords = [
    {
      ...MOCK_CASE,
      docketNumber: '123-20',
      judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
      pk: 'case|123-20',
      sk: 'case|23',
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    },
    {
      barNumber: '1234',
      name: 'Bill Barker',
      pk: 'case|123-20',
      role: ROLES.irsPractitioner,
      sk: 'irsPractitioner|123',
      userId: 'e282ab65-b2a6-4c55-a382-cfd7bc347045',
    },
    {
      barNumber: '1234',
      name: 'Bob Barker',
      pk: 'case|123-20',
      role: ROLES.privatePractitioner,
      sk: 'privatePractitioner|123',
      userId: 'c0f92631-7636-4afd-891d-3beee119d78c',
    },
    {
      archived: true,
      docketEntryId: 'c1928dd1-49a2-4be0-b99f-283adaab5a32',
      documentType: 'Petition',
      eventCode: 'P',
      filedBy: 'Test Petitioner',
      pk: 'case|123-20',
      sk: 'docket-entry|123',
      userId: '8bbfcd5a-b02b-4983-8e9c-6cc50d3d566c',
    },
    {
      archived: false,
      docketEntryId: '83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      documentType: 'Answer',
      eventCode: 'A',
      filedBy: 'Test Petitioner',
      pk: 'case|123-20',
      sk: 'docket-entry|124',
      userId: '8bbfcd5a-b02b-4983-8e9c-6cc50d3d566c',
    },
    {
      archived: true,
      correspondenceId: '5a774345-a479-4bd2-9c9f-bf1fbef0539a',
      documentTitle: 'correspondence 1',
      pk: 'case|123-20',
      sk: 'correspondence|123',
      userId: '8bbfcd5a-b02b-4983-8e9c-6cc50d3d566c',
    },
    {
      archived: false,
      correspondenceId: 'ba0d30e8-6be0-4c57-a400-d148088b1a4d',
      documentTitle: 'correspondence 2',
      pk: 'case|123-20',
      sk: 'correspondence|124',
      userId: '8bbfcd5a-b02b-4983-8e9c-6cc50d3d566c',
    },
    {
      name: 'Judge Fieri',
      pk: 'case|123-20',
      role: ROLES.legacyJudge,
      sk: 'user|ce92c582-186f-45a7-a5f5-e1cec03521ad',
      userId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
    },
  ];

  beforeEach(() => {
    documentClient = {
      query: () => ({
        promise: async () => ({
          Items: [],
        }),
      }),
    };
  });

  it('should return and not modify original records', async () => {
    const items = [
      {
        gsi1pk:
          'eligible-for-trial-case-catalog|1d99457e-e4f4-44fe-8fcc-fd8b0f60d34b',
        pk: 'eligible-for-trial-case-catalog',
        sk: 'eligible-for-trial-case-catalog',
      },
      {
        pk: 'case|123-20',
        sk: 'case|123-20',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          gsi1pk:
            'eligible-for-trial-case-catalog|1d99457e-e4f4-44fe-8fcc-fd8b0f60d34b',
          pk: 'eligible-for-trial-case-catalog',
          sk: 'eligible-for-trial-case-catalog',
        },
        {
          pk: 'case|123-20',
          sk: 'case|123-20',
        },
      ]),
    );
  });

  it('should add eligible for trial case records to returned array for a case in ready for trial status WITHOUT found eligible for trial records', async () => {
    documentClient.query = jest
      .fn()
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [],
        }),
      })
      .mockReturnValueOnce({
        promise: async () => ({
          Items: mockCaseRecords,
        }),
      });

    const mockCase = {
      ...MOCK_CASE,
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    };

    const results = await migrateItems([mockCase], documentClient);

    expect(results).toEqual([
      mockCase,
      {
        docketNumber: '101-18',
        gsi1pk: 'eligible-for-trial-case-catalog|101-18',
        pk: 'eligible-for-trial-case-catalog',
        sk: expect.anything(),
      },
      {
        docketNumber: '101-18',
        gsi1pk: 'eligible-for-trial-case-catalog|101-18',
        pk: 'eligible-for-trial-case-catalog',
        sk: expect.anything(),
      },
    ]);
  });

  it('should NOT add eligible for trial case records to returned array for a case in ready for trial status WITH found eligible for trial records', async () => {
    documentClient.query = jest
      .fn()
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [
            {
              docketNumber: '101-18',
              gsi1pk: 'eligible-for-trial-case-catalog|101-18',
              pk: 'eligible-for-trial-case-catalog',
              sk: expect.anything(),
            },
            {
              docketNumber: '101-18',
              gsi1pk: 'eligible-for-trial-case-catalog|101-18',
              pk: 'eligible-for-trial-case-catalog',
              sk: expect.anything(),
            },
          ],
        }),
      })
      .mockReturnValueOnce({
        promise: async () => ({
          Items: mockCaseRecords,
        }),
      });

    const mockCase = {
      ...MOCK_CASE,
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    };

    const results = await migrateItems([mockCase], documentClient);

    expect(results).toEqual([mockCase]);
  });

  it('should NOT add eligible for trial case records to returned array for a case in ready for trial status without a preferredTrialCity', async () => {
    documentClient.query = jest
      .fn()
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [],
        }),
      })
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [
            { ...mockCaseRecords[0], preferredTrialCity: undefined },
            ...mockCaseRecords.slice(1, 0),
          ],
        }),
      });

    const mockCase = {
      ...MOCK_CASE,
      pk: `case|${MOCK_CASE.docketNumber}`,
      preferredTrialCity: undefined,
      sk: `case|${MOCK_CASE.docketNumber}`,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    };

    const results = await migrateItems([mockCase], documentClient);

    expect(results).toEqual([mockCase]);
  });

  it('should throw an error if the full case retrieved from the query is invalid', async () => {
    documentClient.query = jest
      .fn()
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [],
        }),
      })
      .mockReturnValueOnce({
        promise: async () => ({
          Items: [{ ...mockCaseRecords[0], contactPrimary: {} }],
        }),
      });

    const mockCase = {
      ...MOCK_CASE,
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    };

    await expect(migrateItems([mockCase], documentClient)).rejects.toThrow(
      'The Case entity was invalid',
    );
  });
});
