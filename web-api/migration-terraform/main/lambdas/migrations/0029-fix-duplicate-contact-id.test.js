const {
  COUNTRY_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0029-fix-duplicate-contact-id');
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');
const { omit } = require('lodash');

describe('migrateItems', () => {
  let documentClient;
  let mockCaseRecord;
  let mockContact;

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
  });

  it('should return and not modify records that are NOT open case records without matching contactIds', async () => {
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
      {
        ...mockCaseRecord,
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        status: 'Closed',
      },
      {
        ...mockCaseRecord,
        contactSecondary: null,
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];
    const results = await migrateItems(items, documentClient);

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
      {
        ...mockCaseRecord,
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        status: 'Closed',
      },
      {
        ...mockCaseRecord,
        contactSecondary: null,
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ]);
  });

  it('should not modify the case if the contactPrimary.contactId does not match contactSecondary.contactId', async () => {
    const items = [
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
        },
        contactSecondary: {
          ...mockContact,
          contactId: '1d74eadc-0181-4ff5-826c-305200e8733d',
        },
        pk: 'case|101-21',
        sk: 'case|101-21',
      },
    ];

    const results = await migrateItems(items, documentClient);

    // does nothing to the item
    expect(results).toEqual(items);
  });

  it('should modify the case if the contactPrimary.contactId matches the contactSecondary.contactId', async () => {
    const items = [
      {
        ...mockCaseRecord,
        contactPrimary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
        },
        contactSecondary: {
          ...mockContact,
          contactId: '6d74eadc-0181-4ff5-826c-305200e8733d',
        },
        pk: 'case|101-21',
        sk: 'case|101-21',
        status: 'New',
      },
    ];

    const results = await migrateItems(items, documentClient);

    // should not change anything in the item except contactSecondary.contactId
    expect(results[0]).toMatchObject({
      ...items[0],
      contactSecondary: {
        ...omit(items[0].contactSecondary, 'contactId'),
      },
    });
    expect(results[0].contactSecondary).not.toEqual(
      '6d74eadc-0181-4ff5-826c-305200e8733d',
    );
  });
});
