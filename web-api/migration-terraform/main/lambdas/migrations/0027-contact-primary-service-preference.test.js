const {
  contactHasServiceIndicatorNone,
  migrateItems,
} = require('./0027-contact-primary-service-preference');
const {
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
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

  it('should only modify case records that have an unrepresented contactPrimary with serviceIndicator of None', async () => {
    caseQueryResults = {
      'case|101-21': [],
      'case|102-21': [
        {
          pk: 'case|102-21',
          representing: ['9974eadc-0181-4ff5-826c-305200e8733d'],
          sk: 'privatePractioner|7874eadc-0181-4ff5-826c-305200e8733d',
        },
      ],
      'case|103-21': [
        {
          pk: 'case|103-21',
          representing: ['6d74eadc-0181-4ff5-826c-305200e8733d'],
          sk: 'privatePractioner|7874eadc-0181-4ff5-826c-305200e8733d',
        },
      ],
      'case|104-21': [],
      'case|105-21': [],
    };
    const items = [
      // electronic case, serviceIndicator: None, no practitioners, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
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
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        isPaper: true,
        pk: 'case|102-21',
        sk: 'case|102-21',
      },
      // serviceIndicator: None, practitioner representing primary, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
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
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
        pk: 'case|104-21',
        sk: 'case|104-21',
      },
      // no serviceIndicator, no practitioners, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
        },
        pk: 'case|105-21',
        sk: 'case|105-21',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(queryMock).toHaveBeenCalledTimes(items.length);
    expect(results).toEqual([
      // serviceIndicator: None, no practitioners, should migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
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
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER, // changed to paper
        },
        isPaper: true,
        pk: 'case|102-21',
        sk: 'case|102-21',
      },
      // serviceIndicator: None, practitioner representingPrimary: true, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
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
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE, // no change
        },
        pk: 'case|104-21',
        sk: 'case|104-21',
      },
      // no serviceIndicator, no practitioners, should NOT migrate
      {
        ...mockCaseRecord,
        contactPrimary: {
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
          // serviceIndicator undefined - no change
        },
        pk: 'case|105-21',
        sk: 'case|105-21',
      },
    ]);
  });
});
