const {
  getContactPrimary,
} = require('../../../../../shared/src/business/entities/cases/Case');
const { migrateItems } = require('./0031-add-filers-to-docket-entry');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let documentClient;
  let mockDocketEntry = {
    archived: false,
    docketEntryId: mockDocketEntryId,
    docketNumber: MOCK_CASE.docketNumber,
    documentType: 'Answer',
    eventCode: 'A',
    filedBy: 'Test Petitioner',
    partyPrimary: true,
    pk: 'case|123-20',
    sk: 'docket-entry|124',
    userId: '8bbfcd5a-b02b-4983-8e9c-6cc50d3d566c',
  };

  const mockDocketEntryId = 'f03ff1fa-6b53-4226-a61f-6ad36d25911c';

  let mockCaseItem;
  let mockCaseRecords;

  beforeEach(() => {
    mockCaseItem = {
      ...MOCK_CASE,
      pk: 'case|999-99',
      sk: 'case|999-99',
    };
    mockCaseRecords = [mockCaseItem];

    documentClient = {
      query: () => ({
        promise: async () => ({
          Items: mockCaseRecords,
        }),
      }),
    };
  });

  it('should return and not modify records that are NOT docket entry records', async () => {
    const items = [
      {
        pk: 'case|101-21',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
    ];
    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      {
        pk: 'case|101-21',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
    ]);
  });

  it('should add the primary petitioner contactId to the filers array when partyPrimary is true', async () => {
    const items = [mockDocketEntry];

    const results = await migrateItems(items, documentClient);

    expect(results[0].filers).toEqual([getContactPrimary(MOCK_CASE).contactId]);
    expect(results[0].partyPrimary).toBeUndefined();
  });

  it('should add the secondary petitioner contactId to the filers array when partySecondary is true', async () => {
    const items = [{ ...mockDocketEntry }];

    const results = await migrateItems(items, documentClient);

    expect(results[0].filers).toEqual([getContactPrimary(MOCK_CASE).contactId]);
    expect(results[0].partyPrimary).toBeUndefined();
  });
});
