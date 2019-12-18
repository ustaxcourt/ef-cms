import { fetchPendingItemsAction } from './fetchPendingItemsAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = {
  getUseCases: () => ({
    fetchPendingItemsInteractor: () => ['some content'],
  }),
};

describe('fetchPendingItemsAction', () => {
  it('updates pendingItems', async () => {
    const result = await runAction(fetchPendingItemsAction, {
      modules: {
        presenter,
      },
      props: {
        judge: 'Judge Armen',
      },
    });
    expect(result.output.pendingItems).toEqual(['some content']);
  });
});
