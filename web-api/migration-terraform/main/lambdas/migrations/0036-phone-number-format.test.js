const {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0036-phone-number-format');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let mockCaseItem,
    mockPractitionerItem,
    mockPrivatePractitionerItem,
    mockIrsPractitionerItem,
    mockUserItem;

  beforeEach(() => {
    mockCaseItem = {
      ...MOCK_CASE,
      pk: 'case|999-99',
      sk: 'case|999-99',
    };
    mockPractitionerItem = {
      admissionsDate: '2019-03-01',
      admissionsStatus: 'Active',
      barNumber: 'PT20001',
      birthYear: 2019,
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: COUNTRY_TYPES.INTERNATIONAL,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      email: 'test.practitioner@example.com',
      employer: 'Private',
      entityName: 'Practitioner',
      firmName: 'GW Law Offices',
      firstName: 'Test',
      lastName: 'Practitioner',
      name: 'Test Practitioner',
      originalBarState: 'IL',
      pk: 'user|0f7cd948-5cd7-42b3-b229-c484427185c4',
      practitionerNotes: '',
      practitionerType: 'Attorney',
      role: ROLES.privatePractitioner,
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      sk: 'user|f41c0820-4261-4765-8a15-5593b6b775fa',
      userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
    };
    mockPrivatePractitionerItem = {
      ...mockPractitionerItem,
      pk: 'case|123-20',
      representing: ['887aa76b-221f-4ff1-973a-2cbfea1aae66'],
      sk: 'privatePractitioner|937eeeec-1755-4b67-ad71-88776eab530e',
    };
    mockIrsPractitionerItem = {
      ...mockPractitionerItem,
      pk: 'case|123-20',
      role: ROLES.irsPractitioner,
      sk: 'irsPractitioner|937eeeec-1755-4b67-ad71-88776eab530e',
    };
    mockUserItem = {
      contact: {
        address1: '234 Main St',
        address2: 'Apartment 4',
        address3: 'Under the stairs',
        city: 'Chicago',
        country: 'Brazil',
        countryType: COUNTRY_TYPES.INTERNATIONAL,
        phone: '+1 (555) 555-5555',
        postalCode: '61234',
        state: 'IL',
      },
      email: 'test@example.com',
      entityName: 'User',
      name: 'Test User',
      pk: 'user|0f7cd948-5cd7-42b3-b229-c484427185c4',
      role: ROLES.petitioner,
      sk: 'user|f41c0820-4261-4765-8a15-5593b6b775fa',
      userId: 'ec4fe2e7-52cf-4084-84de-d8e8d151e927',
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

  it('should format petitioner phone numbers if they are 10 digits', async () => {
    const items = [
      {
        ...mockCaseItem,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactType: CONTACT_TYPES.petitioner,
            phone: '1234567890',
          },
          {
            ...MOCK_CASE.petitioners[0],
            contactId: '10f59801-e8f0-4419-a068-408497c83bd1',
            contactType: CONTACT_TYPES.petitioner,
            phone: '9999999999',
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].petitioners[0].phone).toEqual('123-456-7890');
    expect(results[0].petitioners[1].phone).toEqual('999-999-9999');
  });

  it('should NOT change petitioner phone numbers if they are not exactly 10 digits', async () => {
    const items = [
      {
        ...mockCaseItem,
        petitioners: [
          {
            ...MOCK_CASE.petitioners[0],
            contactType: CONTACT_TYPES.petitioner,
            phone: '123-4567-890',
          },
          {
            ...MOCK_CASE.petitioners[0],
            contactId: '10f59801-e8f0-4419-a068-408497c83bd1',
            contactType: CONTACT_TYPES.petitioner,
            phone: '(999)999-9999',
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].petitioners[0].phone).toEqual('123-4567-890');
    expect(results[0].petitioners[1].phone).toEqual('(999)999-9999');
  });

  it('should format case private practitioner phone numbers if they are 10 digits', async () => {
    const items = [
      {
        ...mockPrivatePractitionerItem,
        contact: {
          ...mockPrivatePractitionerItem.contact,
          phone: '1234567890',
        },
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].contact.phone).toEqual('123-456-7890');
  });

  it('should NOT change case private practitioner phone numbers if they are not exactly 10 digits', async () => {
    const items = [
      {
        ...mockPrivatePractitionerItem,
        contact: {
          ...mockPrivatePractitionerItem.contact,
          phone: '123-4567-890',
        },
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].contact.phone).toEqual('123-4567-890');
  });

  it('should format case IRS practitioner phone numbers if they are 10 digits', async () => {
    const items = [
      {
        ...mockIrsPractitionerItem,
        contact: {
          ...mockIrsPractitionerItem.contact,
          phone: '1234567890',
        },
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].contact.phone).toEqual('123-456-7890');
  });

  it('should NOT change case IRS practitioner phone numbers if they are not exactly 10 digits', async () => {
    const items = [
      {
        ...mockIrsPractitionerItem,
        contact: {
          ...mockIrsPractitionerItem.contact,
          phone: '123-4567-890',
        },
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].contact.phone).toEqual('123-4567-890');
  });

  it('should format practitioner user phone numbers if they are 10 digits', async () => {
    const items = [
      {
        ...mockPractitionerItem,
        contact: { ...mockPractitionerItem.contact, phone: '1234567890' },
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].contact.phone).toEqual('123-456-7890');
  });

  it('should NOT format practitioner user phone numbers if they are not exactly 10 digits', async () => {
    const items = [
      {
        ...mockPractitionerItem,
        contact: { ...mockPractitionerItem.contact, phone: '123 456 7890' },
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].contact.phone).toEqual('123 456 7890');
  });

  it('should format user phone numbers if they are 10 digits', async () => {
    const items = [
      {
        ...mockUserItem,
        contact: { ...mockUserItem.contact, phone: '1234567890' },
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].contact.phone).toEqual('123-456-7890');
  });

  it('should NOT format user phone numbers if they are not exactly 10 digits', async () => {
    const items = [
      {
        ...mockUserItem,
        contact: { ...mockUserItem.contact, phone: '123 456 7890' },
      },
    ];

    const results = await migrateItems(items);

    expect(results[0].contact.phone).toEqual('123 456 7890');
  });
});
