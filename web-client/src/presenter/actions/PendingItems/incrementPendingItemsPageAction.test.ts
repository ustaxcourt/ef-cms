import { incrementPendingItemsPageAction } from './incrementPendingItemsPageAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('incrementPendingItemsPageAction', () => {
  it('should increment current page to 1 if page is not defined', async () => {
    const result = await runAction(incrementPendingItemsPageAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        pendingReports: {},
      },
    });

    expect(result.state.pendingReports).toEqual({ pendingItemsPage: 1 });
  });
});
