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

  it('sets state.pendingReports.pendingItems to the passed in props.pendingItems and replaces any items that were previously stored in state.pendingReport.pendingItems', async () => {
    const { state } = await runAction(setPendingItemsAction, {
      props: {
        pendingItems: ['DocketRecord'],
      },
      state: {
        pendingReports: {
          pendingItems: [{}, {}],
        },
      },
    });

    expect(state.pendingReports.pendingItems).toEqual(['DocketRecord']);
  });

  it('sets state.pendingReports.hasPendingItemsResults to true when props.pendingItems contains items', async () => {
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
    expect(state.pendingReports.hasPendingItemsResults).toBe(true);
  });

  it('sets state.pendingReports.hasPendingItemsResults to false when neither props.pendingItems nor state.pendingReports.pendingItems contain items', async () => {
    const { state } = await runAction(setPendingItemsAction, {
      props: {
        pendingItems: [],
      },
      state: {
        pendingReports: {
          pendingItems: [],
        },
      },
    });
    expect(state.pendingReports.hasPendingItemsResults).toBe(false);
  });
});
