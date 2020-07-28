const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getElasticsearchReindexRecords,
} = require('./getElasticsearchReindexRecords');

describe('getElasticsearchReindexRecords', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: async () => ({
        Items: [{ docketNumber: '123-20', pk: 'case|123-20', sk: 'abc' }],
      }),
    });
  });

  it('returns the reindex records from persistence', async () => {
    const results = await getElasticsearchReindexRecords({
      applicationContext,
    });

    expect(
      applicationContext.getDocumentClient().query.mock.calls[0][0],
    ).toMatchObject({
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': 'elasticsearch-reindex',
      },
      KeyConditionExpression: '#pk = :pk',
    });
    expect(results).toEqual([
      { docketNumber: '123-20', pk: 'case|123-20', sk: 'abc' },
    ]);
  });
});
