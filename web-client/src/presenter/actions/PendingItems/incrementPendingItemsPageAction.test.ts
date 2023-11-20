import { incrementPendingItemsPageAction } from './incrementPendingItemsPageAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('incrementPendingItemsPageAction', () => {
  it('should increment by 1', async () => {
    const result = await runAction(incrementPendingItemsPageAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        pendingReports: {
          pendingItemsPage: 0,
        },
      },
    });

    expect(result.state.pendingReports).toEqual({ pendingItemsPage: 1 });
  });
});
