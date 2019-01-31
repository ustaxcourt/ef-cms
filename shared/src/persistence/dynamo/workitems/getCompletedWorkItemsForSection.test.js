const {
  getCompletedWorkItemsForSection,
} = require('./getCompletedWorkItemsForSection');

const client = require('../../dynamodbClientService');
const sinon = require('sinon');

describe('getCompletedWorkItemsForSection', () => {
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
    sinon
      .stub(window.Date.prototype, 'toISOString')
      .returns('2019-01-23T00:00:00Z');
  });

  afterEach(() => {
    client.query.restore();
    client.batchGet.restore();
    window.Date.prototype.toISOString.restore();
  });

  it('invokes the peristence layer with the proper request object and date filter', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    await getCompletedWorkItemsForSection({
      applicationContext,
      section: 'petitions',
    });
    expect(client.query.getCall(0).args[0]).toEqual({
      ExpressionAttributeNames: { '#pk': 'pk', '#sk': 'sk' },
      ExpressionAttributeValues: {
        ':afterDate': '2019-01-16T00:00:00Z',
        ':pk': 'petitions|completedWorkItem',
      },
      KeyConditionExpression: '#pk = :pk AND #sk >= :afterDate',
      TableName: 'efcms-dev',
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
