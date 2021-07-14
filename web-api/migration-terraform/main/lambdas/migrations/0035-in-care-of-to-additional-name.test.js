const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { cloneDeep } = require('lodash');
const { migrateItems } = require('./0035-in-care-of-to-additional-name');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  const mockDocketEntryId = 'f03ff1fa-6b53-4226-a61f-6ad36d25911c';

  let mockCaseItem;
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
    const results = await migrateItems(items);

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

  it('should modify petitioners with inCareOf and map it to its respective additionalName', async () => {
    const mockCaseRecordWithInCareOfPetitioner = cloneDeep(mockCaseItem);
    mockCaseRecordWithInCareOfPetitioner.petitioners[0].inCareOf =
      'John Jacob Jingleheimer-Schmidt';
    mockCaseRecordWithInCareOfPetitioner.petitioners[1].inCareOf = 'Guy Fieri';

    const items = [mockCaseRecordWithInCareOfPetitioner];

    const results = await migrateItems(items);

    expect(results[0].petitioners[0].inCareOf).toBeUndefined();
    expect(results[0].petitioners[1].inCareOf).toBeUndefined();
    expect(results[0].petitioners[0].additionalName).toEqual(
      'c/o John Jacob Jingleheimer-Schmidt',
    );
    expect(results[0].petitioners[1].additionalName).toEqual('c/o Guy Fieri');
  });

  it('should NOT modify petitioners on cases that are new', async () => {
    const mockCaseRecordWithRegularPetitioners = cloneDeep(mockCaseItem);
    mockCaseRecordWithRegularPetitioners.status = CASE_STATUS_TYPES.new;
    mockCaseRecordWithRegularPetitioners.petitioners[0].inCareOf =
      'Jimothy Jazz';
    mockCaseRecordWithRegularPetitioners.petitioners[1].inCareOf = 'Jimmy Jazz';

    const items = [mockCaseRecordWithRegularPetitioners];

    const results = await migrateItems(items);

    expect(results[0].petitioners[0].inCareOf).toEqual('Jimothy Jazz');
    expect(results[0].petitioners[1].inCareOf).toEqual('Jimmy Jazz');
    expect(results[0].petitioners[0].additionalName).toBeUndefined();
    expect(results[0].petitioners[1].additionalName).toBeUndefined();
  });

  it('should NOT modify petitioners WITHOUT the inCareOf property', async () => {
    const mockCaseRecordWithRegularPetitioners = cloneDeep(mockCaseItem);
    mockCaseRecordWithRegularPetitioners.petitioners[0].inCareOf = undefined;
    mockCaseRecordWithRegularPetitioners.petitioners[1].inCareOf = undefined;

    const items = [mockCaseRecordWithRegularPetitioners];

    const results = await migrateItems(items);

    expect(results[0].petitioners[0].inCareOf).toBeUndefined();
    expect(results[0].petitioners[1].inCareOf).toBeUndefined();
    expect(results[0].petitioners[0].additionalName).toBeUndefined();
    expect(results[0].petitioners[1].additionalName).toBeUndefined();
  });
});
