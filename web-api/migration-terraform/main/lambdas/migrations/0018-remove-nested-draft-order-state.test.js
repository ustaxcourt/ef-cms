const { migrateItems } = require('./0018-remove-nested-draft-order-state');

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

  it('should return and not modify docket entry records that do not have nested draftOrderState, nor draftOrderState.richText or draftOrderState.documentContents', async () => {
    const mockDocketEntryNoModify = {
      ...mockDocketEntry,
      draftOrderState: {
        documentTitle: 'blah',
      },
      pk: 'case|999-99',
      sk: 'docket-entry|2129e02c-4122-4368-a888-b3b18196c687',
    };

    const items = [mockDocketEntryNoModify];

    const results = await migrateItems(items);

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining(mockDocketEntryNoModify),
      ]),
    );
  });

  it('should return and modify docket entry records that have draftOrderState.documentContents', async () => {
    const mockDocketEntryContents = {
      ...mockDocketEntry,
      draftOrderState: {
        documentContents: 'Some content\n',
        documentTitle: 'Document title',
      },
      isDraft: false,
      pk: 'case|999-99',
      sk: 'docket-entry|2129e02c-4122-4368-a888-b3b18196c687',
    };

    const items = [mockDocketEntryContents];

    const results = await migrateItems(items);

    expect(results[0]).toMatchObject({
      ...mockDocketEntryContents,
      draftOrderState: {
        documentTitle: 'Document title',
      },
    });
    expect(results[0].draftOrderState.documentContents).toBeUndefined();
  });

  it('should return and modify docket entry records that have draftOrderState.richText', async () => {
    const mockDocketEntryRichText = {
      ...mockDocketEntry,
      draftOrderState: {
        documentTitle: 'Document title',
        richText: '<p>Some content</p>\n',
      },
      isDraft: false,
      pk: 'case|999-99',
      sk: 'docket-entry|2129e02c-4122-4368-a888-b3b18196c687',
    };

    const items = [mockDocketEntryRichText];

    const results = await migrateItems(items);

    expect(results[0]).toMatchObject({
      ...mockDocketEntryRichText,
      draftOrderState: {
        documentTitle: 'Document title',
      },
    });
    expect(results[0].draftOrderState.richText).toBeUndefined();
  });

  it('should return and modify docket entry records that have draftOrderState.draftOrderState', async () => {
    const mockDocketEntryNestedDraftOrderState = {
      ...mockDocketEntry,
      draftOrderState: {
        documentContents: 'Some content',
        documentTitle: 'Document title',
        draftOrderState: {
          documentContents: 'A lotta contnent here\n',
          documentTitle: 'Document title',
          richText: '<p>A lotta content here</p>',
        },
        richText: '<p>Some content</p>\n',
      },
      isDraft: false,
      pk: 'case|999-99',
      sk: 'docket-entry|2129e02c-4122-4368-a888-b3b18196c687',
    };

    const items = [mockDocketEntryNestedDraftOrderState];

    const results = await migrateItems(items);

    expect(results[0]).toMatchObject({
      ...mockDocketEntryNestedDraftOrderState,
      draftOrderState: {
        documentTitle: 'Document title',
      },
    });
    expect(results[0].draftOrderState.documentContents).toBeUndefined();
    expect(results[0].draftOrderState.richText).toBeUndefined();
    expect(results[0].draftOrderState.draftOrderState).toBeUndefined();
  });
});
