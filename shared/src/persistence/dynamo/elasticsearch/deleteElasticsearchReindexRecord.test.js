const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  deleteElasticsearchReindexRecord,
} = require('./deleteElasticsearchReindexRecord');

describe('deleteElasticsearchReindexRecord', () => {
  it('deletes the reindex record', async () => {
    await deleteElasticsearchReindexRecord({
      applicationContext,
      recordPk: '123',
      recordSk: 'abc',
    });

    expect(
      applicationContext.getDocumentClient().delete.mock.calls[0][0],
    ).toMatchObject({
      Key: {
        pk: 'elasticsearch-reindex',
        sk: '123-abc',
      },
    });
  });
});
