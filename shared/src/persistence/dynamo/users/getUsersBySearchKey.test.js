const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const { getUsersBySearchKey } = require('./getUsersBySearchKey');
const { User } = require('../../../business/entities/User');

const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');

describe('getUsersBySearchKey', () => {
  beforeEach(() => {
    client.batchGet = jest.fn().mockReturnValue([
      {
        barNumber: 'PT1234',
        name: 'Test Practitioner',
        pk: 'user|9805d1ab-18d0-43ec-bafb-654e83405416',
        role: User.ROLES.privatePractitioner,
        section: 'privatePractitioner',
        sk: '9805d1ab-18d0-43ec-bafb-654e83405416',
        userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
    client.query = jest.fn().mockReturnValue([
      {
        pk: 'Test Practitioner|privatePractitioner',
        sk: 'user|9805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });

  it('should return data as received from persistence', async () => {
    const result = await getUsersBySearchKey({
      applicationContext,
      searchKey: 'Test Practitioner',
      type: 'privatePractitioner',
    });
    expect(result).toEqual([
      {
        barNumber: 'PT1234',
        name: 'Test Practitioner',
        pk: 'user|9805d1ab-18d0-43ec-bafb-654e83405416',
        role: User.ROLES.privatePractitioner,
        section: 'privatePractitioner',
        sk: '9805d1ab-18d0-43ec-bafb-654e83405416',
        userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });

  it('should return an empty array if no mapping records are returned from the query', async () => {
    client.query = jest.fn().mockReturnValue([]);
    const result = await getUsersBySearchKey({
      applicationContext,
      searchKey: 'Test Practitioner',
      type: 'privatePractitioner',
    });
    expect(result).toEqual([]);
  });
});
