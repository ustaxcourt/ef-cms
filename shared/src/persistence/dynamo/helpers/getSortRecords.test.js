const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { getSortRecords } = require('./getSortRecords');

describe('getSortRecords', () => {
  let getCurrentUserStub;

  beforeEach(() => {
    sinon.stub(client, 'query').resolves(null);
  });

  afterEach(() => {
    client.query.restore();
  });

  it('invokes the persistence layer with the expected pk and sk', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: getCurrentUserStub,
    };
    await getSortRecords({
      afterDate: 'now',
      applicationContext,
      key: 'a',
      type: 'b',
    });
    expect(client.query.getCall(0).args[0]).toMatchObject({
      ExpressionAttributeNames: { '#pk': 'pk', '#sk': 'sk' },
      ExpressionAttributeValues: {
        ':afterDate': 'now',
        ':pk': 'a|b',
      },
      KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
    });
  });
});
