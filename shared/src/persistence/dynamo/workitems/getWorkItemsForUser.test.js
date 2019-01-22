const { getWorkItemsForUser } = require('./getWorkItemsForUser');
const client = require('../../dynamodbClientService');
const sinon = require('sinon');

describe('getWorkItemsForUser', () => {
  beforeEach(() => {
    sinon.stub(client, 'query').resolves([
      {
        workItemId: 'abc',
        pk: 'abc',
        sk: 'abc',
      },
    ]);
    sinon.stub(client, 'batchGet').resolves([
      {
        workItemId: 'abc',
        pk: 'abc',
        sk: 'abc',
      },
    ]);
  });

  afterEach(() => {
    client.query.restore();
  });

  it('makes a post request to the expected endpoint with the expected data', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    const result = await getWorkItemsForUser({
      applicationContext,
    });
    expect(result).toEqual([{ workItemId: 'abc' }]);
  });
});
