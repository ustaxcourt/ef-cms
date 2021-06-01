const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0034-contact-type-primary-secondary');
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
        MOCK_CASE.petitioners[0],
        {
          ...MOCK_CASE.petitioners[0],
          contactId: '7acfa199-c297-46b8-9371-2dc1470a5b26',
          contactType: CONTACT_TYPES.secondary,
        },
        {
          ...MOCK_CASE.petitioners[0],
          contactId: 'b6ef7294-6b3f-4bdb-bd96-390541a2f66a',
          contactType: CONTACT_TYPES.intervenor,
        },
      ],
      pk: 'case|999-99',
      sk: 'case|999-99',
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
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

  it('should return and not modify records that are NOT case records', async () => {
    const items = [
      {
        pk: 'case|101-21',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'case|101-21',
        sk: 'docket-entry|101-21',
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
        sk: 'docket-entry|101-21',
      },
    ]);
  });

  it('should return and not modify records that are unserved case records', async () => {
    const mockUnservedCaseRecord = {
      ...mockCaseItem,
      status: CASE_STATUS_TYPES.new,
    };

    const items = [mockUnservedCaseRecord];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toEqual(mockUnservedCaseRecord);
  });

  it("should modify petitioners in the case item that have contactType 'primary', 'secondary' and 'otherPetitioner' to be 'petitioner' for a served case", async () => {
    const items = [
      {
        ...mockCaseItem,
        petitioners: [
          MOCK_CASE.petitioners[0],
          {
            ...MOCK_CASE.petitioners[0],
            contactId: '7acfa199-c297-46b8-9371-2dc1470a5b26',
            contactType: CONTACT_TYPES.secondary,
          },
          {
            ...MOCK_CASE.petitioners[0],
            contactId: 'b6ef7294-6b3f-4bdb-bd96-390541a2f66a',
            contactType: CONTACT_TYPES.intervenor,
          },
          {
            ...MOCK_CASE.petitioners[0],
            contactId: 'b6ef7256-6b3f-4bdb-bd96-390541a2f66a',
            contactType: CONTACT_TYPES.otherPetitioner,
          },
        ],
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].petitioners[0].contactType).toEqual(
      CONTACT_TYPES.petitioner,
    );
    expect(results[0].petitioners[1].contactType).toEqual(
      CONTACT_TYPES.petitioner,
    );

    expect(results[0].petitioners[2].contactType).toEqual(
      CONTACT_TYPES.intervenor,
    );

    expect(results[0].petitioners[3].contactType).toEqual(
      CONTACT_TYPES.petitioner,
    );
  });

  it("should NOT modify petitioners in the case item that have contactType 'intervenor', or 'participant'", async () => {
    const items = [
      {
        ...mockCaseItem,
        petitioners: [
          MOCK_CASE.petitioners[0],
          {
            ...MOCK_CASE.petitioners[0],
            contactId: 'b6ef7294-6b3f-4bdb-bd96-390541a2f66a',
            contactType: CONTACT_TYPES.intervenor,
          },
        ],
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0].petitioners[1].contactType).toEqual(
      CONTACT_TYPES.intervenor,
    );
  });

  it('should validate the modified case item', async () => {
    const items = [{ ...mockCaseItem, docketNumber: null }];

    await expect(migrateItems(items, documentClient)).rejects.toThrow();
  });
});
