const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  createElasticsearchReindexRecord,
} = require('./createElasticsearchReindexRecord');

describe('createElasticsearchReindexRecord', () => {
  it('persists the reindex record', async () => {
    applicationContext.environment.stage = 'dev';
    await createElasticsearchReindexRecord({
      applicationContext,
      recordPk: '123',
      recordSk: 'abc',
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
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
