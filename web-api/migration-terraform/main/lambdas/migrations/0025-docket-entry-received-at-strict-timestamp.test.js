const {
  migrateItems,
} = require('./0025-docket-entry-received-at-strict-timestamp.js');

describe('migrateItems', () => {
  let mockDocketEntry;
  beforeEach(() => {
    mockDocketEntry = {
      createdAt: '2018-11-21T20:49:28.192Z',
      docketEntryId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
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
      pk: 'case|108-20',
      processingStatus: 'complete',
      scenario: 'Type B',
      signedAt: '2018-03-01T00:01:00.000Z',
      signedByUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      signedJudgeName: 'Judge Guy Fieri',
      sk: 'docket-entry|c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
    };
  });

  it('should return and not modify records that are NOT docket entries', async () => {
    const items = [
      {
        ...mockDocketEntry,
        pk: 'case|000-00',
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockDocketEntry,
        pk: 'case|000-00',
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should not modify the receivedAt field on records whose receivedAt value is undefined', async () => {
    const items = [
      {
        ...mockDocketEntry,
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
  });

  it('should set the receivedAt value to a full ISO timestamp on the given item if defined', async () => {
    const items = [
      {
        ...mockDocketEntry,
        receivedAt: '2018-12-22T03:49:28.192Z', // Dec 21 at 11:49pm EST
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockDocketEntry,
        receivedAt: '2018-12-21T05:00:00.000Z', // Dec 21 at 12:00am EST (start of day)
      },
    ]);
  });
});
