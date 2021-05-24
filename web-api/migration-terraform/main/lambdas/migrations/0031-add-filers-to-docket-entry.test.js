const {
  CONTACT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  getContactPrimary,
  getContactSecondary,
} = require('../../../../../shared/src/business/entities/cases/Case');
const { migrateItems } = require('./0031-add-filers-to-docket-entry');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  const mockDocketEntryId = 'f03ff1fa-6b53-4226-a61f-6ad36d25911c';

  let mockCaseItem;
  let mockCaseRecords;
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

  beforeEach(() => {
    mockCaseItem = {
      ...MOCK_CASE,
      docketEntries: [mockDocketEntry],
      petitioners: [
        ...MOCK_CASE.petitioners,
        {
          ...MOCK_CASE.petitioners[0],
          contactId: '7acfa199-c297-46b8-9371-2dc1470a5b26',
          contactType: CONTACT_TYPES.secondary,
        },
      ],
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

  it('should not update the docketEntry when a case is not found', async () => {
    mockCaseRecords = [];
    const items = [{ ...mockDocketEntry }];

    const results = await migrateItems(items, documentClient);

    expect(results[0].filers).toBeUndefined();
  });

  it('should add the primary petitioner contactId to the filers array when partyPrimary is true', async () => {
    const items = [{ ...mockDocketEntry }];

    const results = await migrateItems(items, documentClient);

    expect(results[0].filers[0]).toEqual(
      getContactPrimary(mockCaseItem).contactId,
    );
    expect(results[0].partyPrimary).toBeUndefined();
  });

  it('should not update filedBy when partyPrimary is true but the case does not have a contactPrimary', async () => {
    mockCaseItem.petitioners = [];
    const items = [{ ...mockDocketEntry, partyPrimary: true }];

    const results = await migrateItems(items, documentClient);

    expect(results[0].filers.length).toEqual(0);
    expect(results[0].filedBy).toEqual(mockDocketEntry.filedBy);
    expect(results[0].partyPrimary).toBeUndefined();
  });

  it('should add the secondary petitioner contactId to the filers array when partySecondary is true', async () => {
    const items = [
      { ...mockDocketEntry, partyPrimary: true, partySecondary: true },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].filers[0]).toEqual(
      getContactPrimary(mockCaseItem).contactId,
    );
    expect(results[0].filers[1]).toEqual(
      getContactSecondary(mockCaseItem).contactId,
    );
    expect(results[0].partySecondary).toBeUndefined();
  });

  it('should not update filedBy when partySecondary is true but the case does not have a contactSecondary', async () => {
    mockCaseItem.petitioners = [...MOCK_CASE.petitioners];
    const items = [
      { ...mockDocketEntry, partyPrimary: true, partySecondary: true },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].filers[0]).toEqual(
      getContactPrimary(mockCaseItem).contactId,
    );
    expect(results[0].filers.length).toEqual(1);
    expect(results[0].filedBy).toEqual(mockDocketEntry.filedBy);
    expect(results[0].partySecondary).toBeUndefined();
  });

  it('should not add to the filers array if no partyPrimary or partySecondary', async () => {
    const items = [
      { ...mockDocketEntry, partyPrimary: false, partySecondary: false },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].filers).toEqual([]);
  });

  it('should not modify the filers array if already present on the docket entry', async () => {
    const mockFilers = ['3daf5975-e5c5-486a-afc1-719181177ccc'];

    const items = [
      { ...mockDocketEntry, filers: mockFilers, partyPrimary: undefined },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].filers).toEqual(mockFilers);
  });
});
