const client = require('../../../../../shared/src/persistence/dynamodbClientService');
const sinon = require('sinon');
const { getInternalUsers } = require('./getInternalUsers');

const applicationContext = {
  environment: {
    stage: 'local',
  },
  filterCaseMetadata: ({ cases }) => cases,
  isAuthorizedForWorkItems: () => true,
};

describe('getInternalUsers', () => {
  beforeEach(() => {
    sinon.stub(client, 'query').resolves([
      {
        pk: 'section|petitions',
        sk: 'user|petitionsclerk1',
        userId: 'petitionsclerk1',
      },
      {
        pk: 'section|docket',
        sk: 'user|docketclerk1',
        userId: 'docketclerk1',
      },
      {
        pk: 'section|adc',
        sk: 'user|adc1',
        userId: 'adc1',
      },
    ]);

    sinon.stub(client, 'batchGet').resolves([
      {
        pk: 'user|petitionsclerk1',
        sk: 'user|petitionsclerk1',
        userId: 'petitionsclerk1',
      },
      {
        pk: 'user|docketclerk1',
        sk: 'user|docketclerk1',
        userId: 'docketclerk1',
      },
      {
        pk: 'user|adc1',
        sk: 'user|adc1',
        userId: 'adc1',
      },
    ]);
  });

  afterEach(() => {
    client.query.restore();
  });

  it('should get the internal users', async () => {
    const result = await getInternalUsers({
      applicationContext,
    });
    expect(result.length).toEqual(9);
  });
});
