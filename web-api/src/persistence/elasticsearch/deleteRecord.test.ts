import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { deleteRecord } from './deleteRecord';

describe('deleteRecord', () => {
  it('calls searchClient.remove if indexName and recordId are passed in', async () => {
    await deleteRecord({
      applicationContext,
      indexName: 'efcms-case',
      recordId: 'pk_sk',
    });
    expect(applicationContext.getSearchClient().remove).toHaveBeenCalled();
  });

  it('does not searchClient.remove if indexName or recordId are not passed in', async () => {
    await deleteRecord({
      applicationContext,
      indexName: 'efcms-case',
    });
    expect(applicationContext.getSearchClient().remove).not.toHaveBeenCalled();

    await deleteRecord({
      applicationContext,
      recordId: 'pk_sk',
    });
    expect(applicationContext.getSearchClient().remove).not.toHaveBeenCalled();
  });
});
