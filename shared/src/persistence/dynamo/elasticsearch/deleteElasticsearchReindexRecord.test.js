const {
  deleteElasticsearchReindexRecord,
} = require('./deleteElasticsearchReindexRecord');

describe('deleteElasticsearchReindexRecord', () => {
  let applicationContext;
  let deleteStub;

  beforeEach(() => {
    deleteStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        delete: deleteStub,
      }),
    };
  });

  it('deletes the reindex record', async () => {
    await deleteElasticsearchReindexRecord({
      applicationContext,
      recordPk: '123',
      recordSk: 'abc',
    });

    expect(deleteStub.mock.calls[0][0]).toMatchObject({
      Key: {
        pk: 'elasticsearch-reindex',
        sk: '123-abc',
      },
    });
  });
});
