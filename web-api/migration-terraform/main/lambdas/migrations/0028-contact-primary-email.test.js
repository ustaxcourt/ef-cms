const {
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0028-contact-primary-email');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let queryMock;
  let caseQueryResults;
  let documentClient;
  let mockCaseRecord;
  let mockContact;
  let mockPrivatePractitioner;

  beforeEach(() => {
    mockCaseRecord = {
      ...MOCK_CASE,
      archivedCorrespondences: [],
      archivedDocketEntries: [],
      correspondence: [],
      docketEntries: [],
      hearings: [],
      irsPractitioners: [],
      pk: 'case|105-20',
      privatePractitioners: [],
      sk: 'case|105-20',
    };

    mockContact = {
      address1: '123 Main St',
      city: 'Somewhere',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: 'petitioner@example.com',
      name: 'Test Petitioner',
      phone: '1234567',
      postalCode: '12345',
      state: 'TN',
    };

    mockPrivatePractitioner = {
      barNumber: 'OK0063',
      contact: {
        address1: '5943 Joseph Summit',
        address2: 'Suite 334',
        address3: null,
        city: 'Millermouth',
        country: 'U.S.A.',
        countryType: 'domestic',
        phone: '348-858-8312',
        postalCode: '99517',
        state: 'AK',
      },
      email: 'thomastorres@example.com',
      entityName: 'PrivatePractitioner',
      name: 'Brandon Choi',
      role: 'privatePractitioner',
      serviceIndicator: 'Electronic',
      userId: '3bcd5fb7-434e-4354-aa08-1d10846c1867',
    };

    queryMock = jest
      .fn()
      .mockImplementation(({ ExpressionAttributeValues }) => ({
        promise: async () => {
          const pk = ExpressionAttributeValues[':pk'];
          const res = {
            Items: caseQueryResults[pk],
          };
          return res;
        },
      }));

    documentClient = {
      query: queryMock,
    };
  });

  it('should return and not modify records that are NOT case records', async () => {
    const items = [
      {
        ...mockCaseRecord,
        pk: 'case|101-21',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        ...mockCaseRecord,
        pk: 'case|101-21',
        sk: 'docket-entry|5d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        ...mockCaseRecord,
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];
    const results = await migrateItems(items, documentClient);

    expect(queryMock).not.toHaveBeenCalled();
    expect(results).toEqual([
      {
        ...mockCaseRecord,
        pk: 'case|101-21',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        ...mockCaseRecord,
        pk: 'case|101-21',
        sk: 'docket-entry|5d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        ...mockCaseRecord,
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should not remove the contactPrimary.email on a case if there are no practitioners', async () => {
    caseQueryResults = {
      'case|101-21': [],
    };
    const items = [
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          email: 'something@example.com',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(results).toEqual([
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          email: 'something@example.com',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
    ]);
  });

  it('should not remove the contactPrimary.email on a case if there are no associated practitioners', async () => {
    caseQueryResults = {
      'case|101-21': [
        {
          ...mockPrivatePractitioner,
          email: 'else@example.com',
          pk: 'case|101-21',
          representing: [],
          sk: 'privatePractitioner|7874eadc-0181-4ff5-826c-305200e8733d',
        },
      ],
    };
    const items = [
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          email: 'something@example.com',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(results).toEqual([
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          email: 'something@example.com',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
    ]);
  });

  it('should remove the contactPrimary.email on a case if there is a practitioner with a matching email', async () => {
    caseQueryResults = {
      'case|101-21': [
        {
          ...mockPrivatePractitioner,
          email: 'something@example.com',
          pk: 'case|101-21',
          representing: ['6d74eadc-0181-4ff5-826c-305200e8733d'],
          sk: 'privatePractitioner|7874eadc-0181-4ff5-826c-305200e8733d',
        },
      ],
    };
    const items = [
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          email: 'something@example.com',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        },
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(results).toEqual([
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          email: undefined,
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE, // changed to none since they have no email
        },
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
    ]);
  });
});
