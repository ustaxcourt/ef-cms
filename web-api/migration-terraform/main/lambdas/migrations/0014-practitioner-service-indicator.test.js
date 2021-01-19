const {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { migrateItems } = require('./0014-practitioner-service-indicator');

describe('migrateItems', () => {
  const MOCK_PRACTITIONER = {
    admissionsDate: '2020-09-02T04:00:00.000Z',
    admissionsStatus: 'Active',
    barNumber: 'PT1234',
    birthYear: '1990',
    employer: 'Private',
    firstName: 'Bob',
    lastName: 'Barker',
    originalBarState: 'TX',
    pk: 'user|6969657f-1d96-4875-9e54-5e53097aed0d',
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
    sk: 'user|6969657f-1d96-4875-9e54-5e53097aed0d',
    userId: '6969657f-1d96-4875-9e54-5e53097aed0d',
  };

  it('should return and not modify records that are NOT practitioner user records', async () => {
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

  it('should return and not modify practitioner user records that have an email address', async () => {
    const items = [
      {
        ...MOCK_PRACTITIONER,
        email: 'test@example.com',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      },
    ];

    const results = await migrateItems(items);

    expect(results).toEqual(items);
  });

  it('should update practitioner user records with service preference paper when they do not have an email', async () => {
    const items = [MOCK_PRACTITIONER];

    const results = await migrateItems(items);

    expect(results).toEqual([
      {
        ...MOCK_PRACTITIONER,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    ]);
  });
});
