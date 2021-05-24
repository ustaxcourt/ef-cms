const {
  CONTACT_TYPES,
  UNIQUE_OTHER_FILER_TYPE,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0032-contact-type-other-filers');
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
          contactType: CONTACT_TYPES.otherFiler,
          otherFilerType: UNIQUE_OTHER_FILER_TYPE,
        },
        {
          ...MOCK_CASE.petitioners[0],
          contactId: '7acfa199-c297-46b8-9371-2dc1470a5b26',
          contactType: CONTACT_TYPES.otherFiler,
          otherFilerType: 'Tax Matters Partner',
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

  it('should modify the intervenor contact otherContactType to the intervenor contact type and remove the old property', async () => {
    const items = [mockCaseItem];

    const results = await migrateItems(items, documentClient);

    expect(results[0].petitioners[1].contactType).toEqual(
      CONTACT_TYPES.intervenor,
    );
    expect(results[0].petitioners[1].otherFilerType).toBeUndefined();
  });

  it('should modify the other filer contact type to participant by default', async () => {
    const items = [mockCaseItem];

    const results = await migrateItems(items, documentClient);

    expect(results[0].petitioners[2].contactType).toEqual(
      CONTACT_TYPES.participant,
    );
    expect(results[0].petitioners[2].otherFilerType).toBeUndefined();
  });
});
