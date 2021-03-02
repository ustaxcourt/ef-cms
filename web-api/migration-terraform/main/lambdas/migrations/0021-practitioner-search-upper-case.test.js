const { migrateItems } = require('./0021-practitioner-search-upper-case');

describe('migrateItems', () => {
  let documentClient;
  const USER_ID = '97c627d1-6e13-4d45-a8e7-421055ac6e20';

  const MOCK_PRIVATE_PRACTITIONER_BAR_NUMBER_RECORD = {
    pk: 'privatePractitioner|pt1234',
    sk: `user|${USER_ID}`,
  };
  const MOCK_PRIVATE_PRACTITIONER_NAME_RECORD = {
    pk: 'privatePractitioner|bob barker',
    sk: `user|${USER_ID}`,
  };
  const MOCK_IRS_PRACTITIONER_BAR_NUMBER_RECORD = {
    pk: 'irsPractitioner|rt9876',
    sk: `user|${USER_ID}`,
  };
  const MOCK_IRS_PRACTITIONER_NAME_RECORD = {
    pk: 'irsPractitioner|bob ross',
    sk: `user|${USER_ID}`,
  };

  beforeEach(() => {});

  it('should return and not modify records that are NOT practitioner search records', async () => {
    const items = [
      {
        pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual(
      expect.arrayContaining([
        {
          pk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
          sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
        },
      ]),
    );
  });

  it('should return practitioner search records with the second part of the pk converted into upper case', async () => {
    const items = [
      MOCK_PRIVATE_PRACTITIONER_BAR_NUMBER_RECORD,
      MOCK_PRIVATE_PRACTITIONER_NAME_RECORD,
      MOCK_IRS_PRACTITIONER_BAR_NUMBER_RECORD,
      MOCK_IRS_PRACTITIONER_NAME_RECORD,
    ];

    const results = await migrateItems(items, documentClient);

    expect(results).toEqual([
      {
        pk: 'privatePractitioner|PT1234',
        sk: 'user|97c627d1-6e13-4d45-a8e7-421055ac6e20',
      },
      {
        pk: 'privatePractitioner|BOB BARKER',
        sk: 'user|97c627d1-6e13-4d45-a8e7-421055ac6e20',
      },
      {
        pk: 'irsPractitioner|RT9876',
        sk: 'user|97c627d1-6e13-4d45-a8e7-421055ac6e20',
      },
      {
        pk: 'irsPractitioner|BOB ROSS',
        sk: 'user|97c627d1-6e13-4d45-a8e7-421055ac6e20',
      },
    ]);
  });
});
