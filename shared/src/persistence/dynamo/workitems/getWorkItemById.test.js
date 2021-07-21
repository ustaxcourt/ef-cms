const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { getWorkItemById } = require('./getWorkItemById');

describe('getWorkItemById', () => {
  beforeEach(() => {
    client.query = jest.fn().mockReturnValue([
      {
        gsi1pk: 'work-item|abc',
        pk: 'case|abc',
        sk: 'work-item|abc',
        workItemId: 'abc',
      },
      {
        gsi1pk: 'work-item|abc',
        pk: 'section-outbox|abc',
        sk: 'work-item|abc',
        workItemId: 'abc',
      },
    ]);
  });

  it('returns the result from query that has a pk starting with case|', async () => {
    const result = await getWorkItemById({
      applicationContext,
    });
    expect(result).toEqual({
      gsi1pk: 'work-item|abc',
      pk: 'case|abc',
      sk: 'work-item|abc',
      workItemId: 'abc',
    });
  });
});
