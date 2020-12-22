const { migrateItems } = require('./0011-judge-title-docket-entry-title');

describe('migrateItems', () => {
  let documentClient;

  const mockDocketEntry = {
    createdAt: '2018-11-21T20:49:28.192Z',
    docketEntryId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    docketNumber: '101-18',
    documentTitle: 'Order that case is assigned to [Judge name] [Anything]',
    documentType: 'Order that case is assigned',
    eventCode: 'OAJ',
    filedBy: 'Test Petitioner',
    filingDate: '2018-03-01T00:01:00.000Z',
    freeText: 'Cheese fries',
    index: 1,
    isFileAttached: true,
    isOnDocketRecord: true,
    judge: 'Fieri',
    pk: 'case|999-99',
    processingStatus: 'complete',
    scenario: 'Type B',
    signedAt: '2018-03-01T00:01:00.000Z',
    signedByUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    signedJudgeName: 'Judge Guy Fieri',
    sk: 'docket-entry|c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
  };

  process.env.SOURCE_TABLE = 'efcms-test';

  beforeEach(() => {
    documentClient = {
      batchGet: () => ({
        promise: async () => ({
          Responses: {
            [process.env.SOURCE_TABLE]: [
              {
                judgeTitle: 'Judge',
                name: 'Fieri',
                pk: 'user|abc-123',
                sk: 'user|abc-123',
              },
            ],
          },
        }),
      }),
      query: () => ({
        promise: async () => ({
          Items: [
            {
              pk: 'section|judge',
              sk: 'user|abc-123',
            },
          ],
        }),
      }),
    };
  });

  it('should return and not modify records that are NOT docket-entry records', async () => {
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

  it('should return and not modify docket entry records that are not Type F or Type B scenarios', async () => {
    const mockDocketEntryTypeAScenario = {
      ...mockDocketEntry,
      pk: 'case|999-99',
      scenario: 'Type A',
      sk: 'docket-entry|2129e02c-4122-4368-a888-b3b18196c687',
    };

    const items = [mockDocketEntryTypeAScenario];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining(mockDocketEntryTypeAScenario),
      ]),
    );
  });

  it('should return and not modify docket entry records that do not have a judge', async () => {
    const mockDocketEntryNoJudge = {
      ...mockDocketEntry,
      judge: undefined,
      pk: 'case|999-99',
      sk: 'docket-entry|2129e02c-4122-4368-a888-b3b18196c687',
    };

    const items = [mockDocketEntryNoJudge];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([expect.objectContaining(mockDocketEntryNoJudge)]),
    );
  });

  it('should return and modify docket entry records with the correct document title', async () => {
    const mockDocketEntryValidChange = {
      ...mockDocketEntry,
      pk: 'case|999-99',
      sk: 'docket-entry|2129e02c-4122-4368-a888-b3b18196c687',
    };

    const items = [mockDocketEntryValidChange];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ...mockDocketEntryValidChange,
          documentTitle:
            'Order that case is assigned to Judge Fieri Cheese fries',
        }),
      ]),
    );
  });
});
