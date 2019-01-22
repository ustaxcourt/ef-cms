const { getWorkItemById } = require('./getWorkItemById');
const client = require('../../dynamodbClientService');
const sinon = require('sinon');

describe('getWorkItemById', () => {
  beforeEach(() => {
    sinon.stub(client, 'get').resolves({
      workItemId: 'abc',
      pk: 'abc',
      sk: 'abc',
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
