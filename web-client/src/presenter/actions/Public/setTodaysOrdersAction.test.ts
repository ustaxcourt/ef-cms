import { PublicClientState } from '@web-client/presenter/state-public';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTodaysOrdersAction } from './setTodaysOrdersAction';

describe('setTodaysOrdersAction', () => {
  it('should set state.todaysOrders.results to props.todaysOrders', async () => {
    const mockTodaysOrders = [
      {
        docketEntryId: '0987',
        documentTitle: 'An order from props',
      },
      {
        docketEntryId: '6543',
        documentTitle: 'Another order from props',
      },
    ];

    const { state } = await runAction<void, PublicClientState>(
      setTodaysOrdersAction,
      {
        props: {
          todaysOrders: mockTodaysOrders,
          totalCount: 2,
        },
        state: {
          todaysOrders: { results: [] },
        },
      },
    );

    expect(state.todaysOrders.results).toMatchObject(mockTodaysOrders);
  });

  it('should replace any existing state.todaysOrders.results with props.todaysOrders', async () => {
    const { state } = await runAction<void, PublicClientState>(
      setTodaysOrdersAction,
      {
        props: {
          todaysOrders: [{ some: 'result' }],
          totalCount: 1,
        },
        state: {
          todaysOrders: { results: [{ some: 'other' }] },
        },
      },
    );

    expect(state.todaysOrders.results).toEqual([{ some: 'result' }]);
  });

  it('should set state.todaysOrders.totalCount from props.totalCount', async () => {
    const { state } = await runAction<void, PublicClientState>(
      setTodaysOrdersAction,
      {
        props: {
          todaysOrders: [],
          totalCount: 17,
        },
        state: {
          todaysOrders: { results: [] },
        },
      },
    );

    expect(state.todaysOrders.totalCount).toBe(17);
  });
});
