const {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  migrateItems,
} = require('./0023-set-served-docket-entries-as-completed');

describe('migrateItems', () => {
  it('should return and not modify records that are NOT docket entries', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        processingStatus: 'not processed yet',
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        processingStatus: 'not processed yet',
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should return and not modify docket entry records when docketEntry.servedAt is undefined and docketEntry.processingStatus is pending', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
        servedAt: undefined,
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
        servedAt: undefined,
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should return and not modify docket entry records when docketEntry.servedAt is defined and docketEntry.processingStatus is complete', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        servedAt: '2018-03-01T00:01:00.000Z',
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        servedAt: '2018-03-01T00:01:00.000Z',
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should set docketEntry.processingStatus to complete when servedAt is defined and processingStatus is pending', async () => {
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

    const items = [
      {
        ...mockDocketEntry,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.pending,
        servedAt: '2018-03-01T00:01:00.000Z',
        servedParties: [],
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...mockDocketEntry,
        processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        servedAt: '2018-03-01T00:01:00.000Z',
        servedParties: [],
        sk: 'docket-entry|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });
});
