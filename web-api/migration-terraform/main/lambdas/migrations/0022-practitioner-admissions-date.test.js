const { migrateItems } = require('./0022-practitioner-admissions-date');
const {
  ROLES,
} = require('../../../../../shared/src/business/entities/EntityConstants');
const { MOCK_PRACTITIONER } = require('../../../../../shared/src/test/mockUsers');

describe('migrateItems', () => {
  let documentClient;
  const USER_ID = '97c627d1-6e13-4d45-a8e7-421055ac6e20';

  const MOCK_IRS_PRACTITIONER = {
    ...MOCK_PRACTITIONER,
    pk: `user|${USER_ID}`,
    sk: `user|${USER_ID}`,
    admissionsDate: '2020-02-29T15:50:41.686Z',
    role: ROLES.irsPractitioner,
  };
  const MOCK_PRIVATE_PRACTITIONER = {
    ...MOCK_PRACTITIONER,
    pk: `user|${USER_ID}`,
    sk: `user|${USER_ID}`,
    admissionsDate: '2020-04-29T15:50:41.686Z',
    role: ROLES.privatePractitioner,
  };
  const MOCK_INACTIVE_PRACTITIONER = {
    ...MOCK_PRACTITIONER,
    pk: `user|${USER_ID}`,
    sk: `user|${USER_ID}`,
    admissionsDate: '2020-03-29T15:50:41.686Z',
    admissionsStatus: 'Inactive',
    role: ROLES.inactivePractitioner,
  };

  beforeEach(() => {});

  it('should return and not modify records that are NOT practitioner user records', async () => {
    const items = [
      {
        pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          pk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
          sk: 'case|6d74eadc-0181-4ff5-826c-305200e8733d',
        },
      ]),
    );
  });

  it('should return and not modify records that are NOT privatePractitioner, irsPractitioner, or inactivePractitioner user records', async () => {
    const items = [
      {
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        role: 'petitioner',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toMatchObject(
        {
          pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
          sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
          role: 'petitioner',
        }
    );
  });

  it.only('should return and modify irsPractitioner records', async () => {
    const items = [
      MOCK_IRS_PRACTITIONER
    ];

    console.log('going in', items);

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toMatchObject(
      {
       ...MOCK_IRS_PRACTITIONER,
       admissionsDate: '2020-02-29'
      },
    );
  });

  it('should return and modify inactivePractitioner records', async () => {
    const items = [
      MOCK_INACTIVE_PRACTITIONER
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toMatchObject(
      {
       ...MOCK_INACTIVE_PRACTITIONER,
       admissionsDate: '2020-03-29'
      },
    );
  });

  it('should return and modify privatePractitioner records', async () => {
    const items = [
      MOCK_PRIVATE_PRACTITIONER
    ];

    const results = await migrateItems(items, documentClient);

    expect(results[0]).toMatchObject(
      {
       ...MOCK_PRIVATE_PRACTITIONER,
       admissionsDate: '2020-04-29'
      },
    );
  });
});
