const {
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./bug-0039-notice-of-trial-date');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let mockCaseItem;
  let mockDocketEntryItems;
  let documentClient;

  beforeEach(() => {
    mockCaseItem = {
      ...MOCK_CASE,
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
    };

    mockDocketEntryItems = [
      {
        archived: false,
        docketEntryId: '83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-entry|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
        userId: '8bbfcd5a-b02b-4983-8e9c-6cc50d3d566c',
      },
    ];

    documentClient = {
      query: jest.fn().mockImplementation(() => ({
        promise: async () => ({
          Items: [mockCaseItem, ...mockDocketEntryItems],
        }),
      })),
    };
  });

  it('should return and not modify records that are NOT case records', async () => {
    const items = [
      {
        noticeOfTrialDate: '2025-04-10T04:00:00.000Z',
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        noticeOfTrialDate: '2025-04-10T04:00:00.000Z',
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-entry|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
    ];
    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      {
        noticeOfTrialDate: '2025-04-10T04:00:00.000Z', // field doesn't belong here, but proving it is unmodified
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        noticeOfTrialDate: '2025-04-10T04:00:00.000Z', // field doesn't belong here, but proving it is unmodified
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-entry|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
    ]);

    expect(documentClient.query).not.toHaveBeenCalled();
  });

  it('should unset the noticeOfTrialDate field for the given case if a notice of trial IS NOT found on the docket record', async () => {
    const items = [
      {
        ...mockCaseItem,
        noticeOfTrialDate: '2025-04-10T04:00:00.000Z',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].noticeOfTrialDate).toBeUndefined();
  });

  it('should NOT unset the noticeOfTrialDate field for the given case if a notice of trial IS found on the docket record', async () => {
    mockDocketEntryItems.push({
      archived: false,
      docketEntryId: '99977e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      documentType: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.documentType,
      eventCode: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfTrial.eventCode,
      filedBy: 'Test Petitioner',
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: 'docket-entry|99977e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      userId: '8bbfcd5a-b02b-4983-8e9c-6cc50d3d566c',
    });

    const items = [
      {
        ...mockCaseItem,
        noticeOfTrialDate: '2025-04-10T04:00:00.000Z',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].noticeOfTrialDate).toEqual('2025-04-10T04:00:00.000Z');
  });
});
