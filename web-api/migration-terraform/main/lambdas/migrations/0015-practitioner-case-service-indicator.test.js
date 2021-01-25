const {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0015-practitioner-case-service-indicator');

describe('migrateItems', () => {
  const MOCK_CASE_PRACTITIONER = {
    barNumber: 'PT1234',
    contact: {
      address1: '234 Main St',
      address2: 'Apartment 4',
      address3: 'Under the stairs',
      city: 'Chicago',
      countryType: 'domestic',
      phone: '+1 (555) 555-5555',
      postalCode: '61234',
      state: 'IL',
    },
    entityName: 'PrivatePractitioner',
    name: 'Test Private Practitioner',
    pk: 'case|101-20',
    representing: ['7805d1ab-18d0-43ec-bafb-654e83405416'],
    representingPrimary: true,
    role: 'privatePractitioner',
    section: 'privatePractitioner',
    serviceIndicator: 'Electronic',
    sk: 'privatePractitioner|9805d1ab-18d0-43ec-bafb-654e83405416',
    userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
  };

  const MOCK_CASE_IRS_PRACTITIONER = {
    barNumber: 'PT4321',
    contact: {
      address1: '234 Main St',
      address2: 'Apartment 4',
      address3: 'Under the stairs',
      city: 'Chicago',
      countryType: 'domestic',
      phone: '+1 (555) 555-5555',
      postalCode: '61234',
      state: 'IL',
    },
    entityName: 'IrsPractitioner',
    name: 'Test IRS Practitioner',
    pk: 'case|101-20',
    representing: ['7805d1ab-18d0-43ec-bafb-654e83405416'],
    representingPrimary: true,
    role: 'irsPractitioner',
    section: 'irsPractitioner',
    serviceIndicator: 'Electronic',
    sk: 'irsPractitioner|9805d1ab-18d0-43ec-bafb-654e83405416',
    userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
  };

  it('should return and not modify records that are NOT case practitioner records', async () => {
    const items = [
      {
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        role: ROLES.judge,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: 'trial-session|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'trial-session|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
  });

  it('should return and not modify case practitioner records that have an email address', async () => {
    const items = [
      {
        ...MOCK_CASE_PRACTITIONER,
        email: 'test@example.com',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
  });

  it('should update case practitioner records with service preference paper when they do not have an email', async () => {
    const items = [MOCK_CASE_PRACTITIONER];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...MOCK_CASE_PRACTITIONER,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    ]);
  });

  it('should update case IRS practitioner records with service preference paper when they do not have an email', async () => {
    const items = [MOCK_CASE_IRS_PRACTITIONER];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...MOCK_CASE_IRS_PRACTITIONER,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    ]);
  });
});
