const {
  createElasticsearchReindexRecord,
} = require('./createElasticsearchReindexRecord');

describe('createElasticsearchReindexRecord', () => {
  let applicationContext;
  let putStub;

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
  });

  it('persists the reindex record', async () => {
    await createElasticsearchReindexRecord({
      applicationContext,
      recordPk: '123',
      recordSk: 'abc',
    });
    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'elasticsearch-reindex',
        recordPk: '123',
        recordSk: 'abc',
        sk: '123-abc',
      },
      TableName: 'efcms-dev',
    });
  });
});
