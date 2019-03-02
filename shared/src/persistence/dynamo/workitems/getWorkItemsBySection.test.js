const { getWorkItemsBySection } = require('./getWorkItemsBySection');
const client = require('../../dynamodbClientService');
const sinon = require('sinon');

describe('getWorkItemsBySection', () => {
  beforeEach(() => {
    sinon.stub(client, 'query').resolves([
      {
        pk: 'abc',
        sk: 'abc',
        workItemId: 'abc',
      },
    ]);
    sinon.stub(client, 'batchGet').resolves([
      {
        pk: 'abc',
        sk: 'abc',
        workItemId: 'abc',
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
    const result = await getWorkItemsBySection({
      applicationContext,
    });
    expect(result).toEqual([{ workItemId: 'abc' }]);
  });
});
