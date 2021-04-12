const {
  CASE_STATUS_TYPES,
  COUNTRY_TYPES,
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const {
  contactHasServiceIndicatorNone,
  migrateItems,
} = require('./0027-contact-primary-secondary-service-preference');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('contactHasServiceIndicatorNone', () => {
  it('returns false if contact is undefined', () => {
    const item = {};
    const result = contactHasServiceIndicatorNone(item.contactPrimary);
    expect(result).toEqual(false);
  });

  it('returns false if contact.serviceIndicator is undefined', () => {
    const item = {
      contactPrimary: {},
    };
    const result = contactHasServiceIndicatorNone(item.contactPrimary);
    expect(result).toEqual(false);
  });

  it('returns false if contact.serviceIndicator is not None', () => {
    const item = {
      contactPrimary: {
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    };
    const result = contactHasServiceIndicatorNone(item.contactPrimary);
    expect(result).toEqual(false);
  });

  it('returns true if contact.serviceIndicator is None', () => {
    const item = {
      contactPrimary: {
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
      },
    };
    const result = contactHasServiceIndicatorNone(item.contactPrimary);
    expect(result).toEqual(true);
  });
});

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
      archivedCorrespondences: [{}],
      archivedDocketEntries: [{}],
      correspondence: [{}],
      docketEntries: [{}],
      hearings: [{}],
      irsPractitioners: [{}],
      pk: 'case|105-20',
      privatePractitioners: [{}],
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

  it('should only modify case records that have an unrepresented contactPrimary and/or contactSecondary with serviceIndicator of None', async () => {
    caseQueryResults = {
      'case|101-21': [],
      'case|102-21': [
        {
          ...mockPrivatePractitioner,
          pk: 'case|102-21',
          representing: ['9974eadc-0181-4ff5-826c-305200e8733d'], // nobody
          sk: 'privatePractitioner|7874eadc-0181-4ff5-826c-305200e8733d',
        },
      ],
      'case|103-21': [
        {
          ...mockPrivatePractitioner,
          pk: 'case|103-21',
          representing: ['6d74eadc-0181-4ff5-826c-305200e8733d'], // contactPrimary
          sk: 'privatePractitioner|7874eadc-0181-4ff5-826c-305200e8733d',
        },
      ],
      'case|104-21': [],
      'case|105-21': [],
      'case|106-21': [],
      'case|107-21': [],
      'case|108-21': [
        {
          ...mockPrivatePractitioner,
          pk: 'case|108-21',
          representing: ['dd74eadc-0181-4ff5-826c-305200e8733d'], // contactSecondary
          sk: 'privatePractitioner|7874eadc-0181-4ff5-826c-305200e8733d',
        },
      ],
      'case|109-21': [
        {
          ...mockPrivatePractitioner,
          pk: 'case|109-21',
          representing: [
            '6d74eadc-0181-4ff5-826c-305200e8733d', //contactPrimary
            'dd74eadc-0181-4ff5-826c-305200e8733d', // contactSecondary
          ],
          sk: 'privatePractitioner|7874eadc-0181-4ff5-826c-305200e8733d',
        },
      ],
    };
    const items = [
      // electronic case, serviceIndicator: None, no practitioners, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
      // paper case, serviceIndicator: None, no practitioner representing primary, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        isPaper: true,
        mailingDate: '04/16/2019',
        pk: 'case|102-21',
        sk: 'case|102-21',
      },
      // serviceIndicator: None, practitioner representing primary, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        pk: 'case|103-21',
        sk: 'case|103-21',
      },
      // serviceIndicator: Paper, no practitioners, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
        pk: 'case|104-21',
        sk: 'case|104-21',
      },
      // no serviceIndicator, no practitioners, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
        },
        pk: 'case|105-21',
        sk: 'case|105-21',
      },
      // electronic case, primary serviceIndicator: paper, secondary serviceIndicator: None, no practitioners, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
        contactSecondary: {
          ...mockContact,
          contactId: 'dd74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        pk: 'case|106-21',
        sk: 'case|106-21',
      },
      // electronic case, primary serviceIndicator: None, secondary serviceIndicator: None, no practitioners, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        contactSecondary: {
          ...mockContact,
          contactId: 'dd74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        pk: 'case|107-21',
        sk: 'case|107-21',
      },
      // electronic case, primary serviceIndicator: None, secondary serviceIndicator: None, practitioner representing secondary, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        contactSecondary: {
          ...mockContact,
          contactId: 'dd74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        pk: 'case|108-21',
        sk: 'case|108-21',
      },
      // electronic case, primary serviceIndicator: None, secondary serviceIndicator: None, practitioner representing primary and secondary, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        contactSecondary: {
          ...mockContact,
          contactId: 'dd74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        pk: 'case|109-21',
        sk: 'case|109-21',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(queryMock).toHaveBeenCalledTimes(7);
    expect(results).toEqual([
      // serviceIndicator: None, no practitioners, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC, // changed to electronic
        },
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
      // serviceIndicator: None, no practitioner representingPrimary: true, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, // changed to paper
        },
        isPaper: true,
        mailingDate: '04/16/2019',
        pk: 'case|102-21',
        sk: 'case|102-21',
      },
      // serviceIndicator: None, practitioner representingPrimary: true, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE, // no change
        },
        pk: 'case|103-21',
        sk: 'case|103-21',
      },
      // serviceIndicator: Paper, no practitioners, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, // no change
        },
        pk: 'case|104-21',
        sk: 'case|104-21',
      },
      // no serviceIndicator, no practitioners, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          // serviceIndicator undefined - no change
        },
        pk: 'case|105-21',
        sk: 'case|105-21',
      },
      // electronic case, primary serviceIndicator: paper, secondary serviceIndicator: None, no practitioners, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, // no change
        },
        contactSecondary: {
          ...mockContact,
          contactId: 'dd74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, // changed to paper
        },
        pk: 'case|106-21',
        sk: 'case|106-21',
      },
      // electronic case, primary serviceIndicator: None, secondary serviceIndicator: None, no practitioners, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC, // changed to electronic
        },
        contactSecondary: {
          ...mockContact,
          contactId: 'dd74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, // changed to paper
        },
        pk: 'case|107-21',
        sk: 'case|107-21',
      },
      // electronic case, primary serviceIndicator: None, secondary serviceIndicator: None, practitioner representing secondary, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC, // changed to electronic
        },
        contactSecondary: {
          ...mockContact,
          contactId: 'dd74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE, // no change
        },
        pk: 'case|108-21',
        sk: 'case|108-21',
      },
      // electronic case, primary serviceIndicator: None, secondary serviceIndicator: None, practitioner representing primary and secondary, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE, // no change
        },
        contactSecondary: {
          ...mockContact,
          contactId: 'dd74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE, // no change
        },
        pk: 'case|109-21',
        sk: 'case|109-21',
      },
    ]);
  });

  it('should return and not modify case records that are closed', async () => {
    caseQueryResults = {
      'case|101-21': [],
      'case|102-21': [],
    };

    const items = [
      // CLOSED electronic case, serviceIndicator: None, no practitioners, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        pk: 'case|101-21',
        sk: 'case|101-21',
        status: CASE_STATUS_TYPES.closed,
      },
      // electronic case, serviceIndicator: None, no practitioner representing primary, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        pk: 'case|102-21',
        sk: 'case|102-21',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(queryMock).toHaveBeenCalledTimes(1);
    expect(results).toEqual([
      // CLOSED case, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE, // no change
        },
        pk: 'case|101-21',
        sk: 'case|101-21',
        status: CASE_STATUS_TYPES.closed,
      },
      // serviceIndicator: None, no practitioner representingPrimary: true, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC, // changed to paper
        },
        pk: 'case|102-21',
        sk: 'case|102-21',
      },
    ]);
  });
});
