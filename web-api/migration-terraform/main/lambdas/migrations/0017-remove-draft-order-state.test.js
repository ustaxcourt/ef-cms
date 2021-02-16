const { migrateItems } = require('./0017-remove-draft-order-state');

describe('migrateItems', () => {
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

  it('should return and not modify records that are NOT docket-entry records', async () => {
    const items = [
      {
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
          sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        },
      ]),
    );
  });

  it('should return and not modify docket entry records that are draft docket entries', async () => {
    const mockDocketEntryTypeAScenario = {
      ...mockDocketEntry,
      isDraft: true,
      pk: 'case|999-99',
      sk: 'docket-entry|2129e02c-4122-4368-a888-b3b18196c687',
    };

    const items = [mockDocketEntryTypeAScenario];

    const results = await migrateItems(items);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining(mockDocketEntryTypeAScenario),
      ]),
    );
  });

  it('should return and not modify docket entry records that are not drafts without a draftOrderState', async () => {
    const mockDocketEntryNoJudge = {
      ...mockDocketEntry,
      draftOrderState: null,
      isDraft: false,
      pk: 'case|999-99',
      sk: 'docket-entry|2129e02c-4122-4368-a888-b3b18196c687',
    };

    const items = [mockDocketEntryNoJudge];

    const results = await migrateItems(items);

    expect(results).toEqual(
      expect.arrayContaining([expect.objectContaining(mockDocketEntryNoJudge)]),
    );
  });

  it('should return and modify non-draft docket entry records with a draftOrderState', async () => {
    const mockDocketEntryValidChange = {
      ...mockDocketEntry,
      draftOrderState: {
        documentContents: 'Some content',
        draftOrderState: {},
        richText: '<p>Some content</p>',
      },
      isDraft: false,
      pk: 'case|999-99',
      sk: 'docket-entry|2129e02c-4122-4368-a888-b3b18196c687',
    };

    const items = [mockDocketEntryValidChange];

    const results = await migrateItems(items);

    expect(results[0]).toMatchObject({
      ...mockDocketEntryValidChange,
      draftOrderState: undefined,
    });
  });
});
