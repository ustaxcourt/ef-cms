const {
  getElasticsearchReindexRecords,
} = require('./getElasticsearchReindexRecords');

describe('getElasticsearchReindexRecords', () => {
  let applicationContext;
  let queryStub;

  beforeEach(() => {
    queryStub = jest.fn().mockReturnValue({
      promise: async () => ({
        Items: [{ caseId: '123', pk: 'case-123', sk: 'abc' }],
      }),
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
    };
  });

  it('returns the reindex records from persistence', async () => {
    const results = await getElasticsearchReindexRecords({
      applicationContext,
    });

    expect(queryStub.mock.calls[0][0]).toMatchObject({
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': 'elasticsearch-reindex',
      },
      KeyConditionExpression: '#pk = :pk',
    });
    expect(results).toEqual([{ caseId: '123', pk: 'case-123', sk: 'abc' }]);
  });
});
