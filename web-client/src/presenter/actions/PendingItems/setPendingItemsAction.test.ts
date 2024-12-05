import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setPendingItemsAction } from './setPendingItemsAction';

describe('setPendingItemsAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('sets state.pendingReports.pendingItems to the passed in props.pendingItems', async () => {
    applicationContext.getUtilities().formatPendingItem.mockReturnValue({});

    const { state } = await runAction(setPendingItemsAction, {
      modules: { presenter },
      props: {
        pendingItems: [{}],
      },
      state: {
        pendingReports: {
          pendingItems: [],
        },
      },
    });
    console.log(state.pendingReports);
    expect(state.pendingReports.pendingItems).toEqual([{}]);
  });

  it('sets state.pendingReports.pendingItems to the passed in props.pendingItems and replaces any items that were previously stored in state.pendingReport.pendingItems', async () => {
    applicationContext.getUtilities().formatPendingItem.mockReturnValue({});

    const { state } = await runAction(setPendingItemsAction, {
      modules: { presenter },
      props: {
        pendingItems: [{}],
      },
      state: {
        pendingReports: {
          pendingItems: [{}, {}],
        },
      },
    });

    expect(state.pendingReports.pendingItems).toEqual([{}]);
  });

  it('sets state.pendingReports.hasPendingItemsResults to true when props.pendingItems contains items', async () => {
    const { state } = await runAction(setPendingItemsAction, {
      modules: { presenter },
      props: {
        pendingItems: [{}],
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
      modules: { presenter },
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
