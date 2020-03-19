const client = require('../../dynamodbClientService');
const { getWorkItemById } = require('./getWorkItemById');

describe('getWorkItemById', () => {
  beforeEach(() => {
    client.get = jest.fn().mockReturnValue({
      pk: 'abc',
      sk: 'abc',
      workItemId: 'abc',
    });
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
    expect(result).toEqual({ pk: 'abc', sk: 'abc', workItemId: 'abc' });
  });
});
