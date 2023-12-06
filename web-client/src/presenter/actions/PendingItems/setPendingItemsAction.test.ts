import { runAction } from '@web-client/presenter/test.cerebral';
import { setPendingItemsAction } from './setPendingItemsAction';

describe('setPendingItemsAction', () => {
  it('sets state.pendingReports.pendingItems to the passed in props.pendingItems', async () => {
    const { state } = await runAction(setPendingItemsAction, {
      props: {
        pendingItems: ['DocketRecord'],
      },
      state: {
        pendingReports: {
          pendingItems: [],
        },
      },
    });
    expect(state.pendingReports.pendingItems).toEqual(['DocketRecord']);
  });
});
