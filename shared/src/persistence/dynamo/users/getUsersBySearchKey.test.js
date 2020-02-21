const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { getUsersBySearchKey } = require('./getUsersBySearchKey');
const { User } = require('../../../business/entities/User');

const applicationContext = {
  environment: {
    stage: 'local',
  },
};

describe('getUsersBySearchKey', () => {
  beforeEach(() => {
    sinon.stub(client, 'batchGet').resolves([
      {
        barNumber: 'PT1234',
        name: 'Test Practitioner',
        pk: '9805d1ab-18d0-43ec-bafb-654e83405416',
        role: User.ROLES.practitioner,
        section: 'practitioner',
        sk: '9805d1ab-18d0-43ec-bafb-654e83405416',
        userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
    sinon.stub(client, 'query').resolves([
      {
        pk: 'Test Practitioner|practitioner',
        sk: '9805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });

  afterEach(() => {
    client.batchGet.restore();
    client.query.restore();
  });

  it('should return data as received from persistence', async () => {
    const result = await getUsersBySearchKey({
      applicationContext,
      searchKey: 'Test Practitioner',
      type: 'practitioner',
    });
    expect(result).toEqual([
      {
        barNumber: 'PT1234',
        name: 'Test Practitioner',
        pk: '9805d1ab-18d0-43ec-bafb-654e83405416',
        role: User.ROLES.practitioner,
        section: 'practitioner',
        sk: '9805d1ab-18d0-43ec-bafb-654e83405416',
        userId: '9805d1ab-18d0-43ec-bafb-654e83405416',
      },
    ]);
  });

  it('should return an empty array if no mapping records are returned from the query', async () => {
    client.query.resolves([]);
    const result = await getUsersBySearchKey({
      applicationContext,
      searchKey: 'Test Practitioner',
      type: 'practitioner',
    });
    expect(result).toEqual([]);
  });
});
