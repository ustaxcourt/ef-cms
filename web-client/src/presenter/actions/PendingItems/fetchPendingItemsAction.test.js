import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { fetchPendingItemsAction } from './fetchPendingItemsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

presenter.providers.applicationContext = applicationContext;

describe('fetchPendingItemsAction', () => {
  applicationContext
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
      applicationContext.getUseCases().fetchPendingItemsInteractor,
    ).toBeCalled();
    expect(result.output.pendingItems).toEqual(['some content']);
    expect(result.output.total).toEqual(10);
  });
});
