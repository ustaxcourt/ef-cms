const client = require('../../dynamodbClientService');
const sinon = require('sinon');
const { getWorkItemById } = require('./getWorkItemById');

describe('getWorkItemById', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      pk: 'abc',
      sk: 'abc',
      workItemId: 'abc',
    });
  });

  afterEach(() => {
    client.get.restore();
  });

  it('makes a post request to the expected endpoint with the expected data', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
    };
    const result = await getWorkItemById({
      applicationContext,
    });
    expect(result).toEqual({ workItemId: 'abc' });
  });
});
