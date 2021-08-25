const {
  INITIAL_DOCUMENT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./bug-0040-case-received-at');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let mockCaseItem;
  let documentClient;
  let mockPetitionItem;

  beforeEach(() => {
    mockCaseItem = {
      ...MOCK_CASE,
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
    };

    mockPetitionItem = {
      archived: false,
      docketEntryId: '83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      documentType: INITIAL_DOCUMENT_TYPES.petition.documentType,
      eventCode: INITIAL_DOCUMENT_TYPES.petition.eventCode,
      filedBy: 'Test Petitioner',
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: 'docket-entry|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      userId: '8bbfcd5a-b02b-4983-8e9c-6cc50d3d566c',
    };

    documentClient = {
      query: jest.fn().mockImplementation(() => ({
        promise: async () => ({
          Items: [mockCaseItem, mockPetitionItem],
        }),
      })),
    };
  });

  it('should return and not modify records that are NOT case records', async () => {
    const items = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-entry|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
    ];
    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-entry|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
    ]);

    expect(documentClient.query).not.toHaveBeenCalled();
  });

  it('should return and not modify case records that are paper filings', async () => {
    mockPetitionItem.receivedAt = '2020-01-01T16:00:00.000Z';

    const items = [
      {
        ...mockCaseItem,
        isPaper: true,
        mailingDate: '2020-06-01T16:00:00.000Z',
        receivedAt: '2021-06-06T16:00:00.000Z',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(documentClient.query).not.toHaveBeenCalled();
    expect(results[0].receivedAt).toEqual('2021-06-06T16:00:00.000Z');
  });

  it('should update the case.receivedAt field to match the petition recievedAt if they do not match and the case is electronic', async () => {
    mockPetitionItem.receivedAt = '2020-01-01T16:00:00.000Z';

    const items = [
      {
        ...mockCaseItem,
        isPaper: false,
        receivedAt: '2021-06-06T16:00:00.000Z', // a newer (incorrect) date
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].receivedAt).toEqual('2020-01-01T16:00:00.000Z'); // the petition date
  });

  it('should NOT update the case.receivedAt field to match the petition recievedAt if they match and the case is electronic', async () => {
    mockPetitionItem.receivedAt = '2021-06-06T16:00:00.000Z';

    const items = [
      {
        ...mockCaseItem,
        isPaper: false,
        receivedAt: '2021-06-06T16:00:00.000Z',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].receivedAt).toEqual('2021-06-06T16:00:00.000Z');
  });

  it('should NOT update the case.receivedAt field to match the petition recievedAt if both dates fall on the same on the same day and the case is electronic', async () => {
    mockPetitionItem.receivedAt = '2021-06-06T14:01:01.011Z';

    const items = [
      {
        ...mockCaseItem,
        isPaper: false,
        receivedAt: '2021-06-06T16:00:00.000Z', // same day as petition, but different time
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].receivedAt).toEqual('2021-06-06T16:00:00.000Z');
  });
});
