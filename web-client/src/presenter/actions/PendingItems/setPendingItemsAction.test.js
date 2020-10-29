import { runAction } from 'cerebral/test';
import { setPendingItemsAction } from './setPendingItemsAction';

describe('setPendingItemsAction', () => {
  it('sets state.pendingItems to the passed in props.pendingItems', async () => {
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
