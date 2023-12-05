import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { fetchPendingItemsAction } from './fetchPendingItemsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContextForClient;

describe('fetchPendingItemsAction', () => {
  applicationContextForClient
    .getUseCases()
    .fetchPendingItemsInteractor.mockResolvedValue({
      foundDocuments: ['some content'],
      total: 10,
    });

  it('updates pendingItems', async () => {
    const result = await runAction(fetchPendingItemsAction, {
      modules: {
        presenter,
      },
      props: {
        judge: 'Judge Colvin',
      },
    });

    expect(
      applicationContextForClient.getUseCases().fetchPendingItemsInteractor,
    ).toHaveBeenCalled();
    expect(result.output.pendingItems).toEqual(['some content']);
    expect(result.output.total).toEqual(10);
  });
});
