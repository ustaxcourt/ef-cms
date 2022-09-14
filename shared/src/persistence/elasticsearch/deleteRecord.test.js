const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { deleteRecord } = require('./deleteRecord');

describe('deleteRecord', () => {
  it('calls searchClient.delete if indexName and recordId are passed in', async () => {
    await deleteRecord({
      applicationContext,
      indexName: 'efcms-case',
      recordId: 'pk_sk',
    });
    expect(applicationContext.getSearchClient().delete).toHaveBeenCalled();
  });

  it('does not searchClient.delete if indexName or recordId are not passed in', async () => {
    await deleteRecord({
      applicationContext,
      indexName: 'efcms-case',
    });
    expect(applicationContext.getSearchClient().delete).not.toHaveBeenCalled();

    await deleteRecord({
      applicationContext,
      recordId: 'pk_sk',
    });
    expect(applicationContext.getSearchClient().delete).not.toHaveBeenCalled();
  });
});
