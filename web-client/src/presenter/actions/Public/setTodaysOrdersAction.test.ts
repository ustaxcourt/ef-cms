import { runAction } from '@web-client/presenter/test.cerebral';
import { setTodaysOrdersAction } from './setTodaysOrdersAction';

describe('setTodaysOrdersAction', () => {
  it('should set state.todaysOrders.results from props.todaysOrders.results and state.todaysOrders.results', async () => {
    const mockTodaysOrdersFromState = [
      {
        docketEntryId: '1234',
        documentTitle: 'An order',
      },
      {
        docketEntryId: '5678',
        documentTitle: 'Another order',
      },
    ];
    const mockTodaysOrdersFromProps = [
      {
        docketEntryId: '0987',
        documentTitle: 'An order from props',
      },
      {
        docketEntryId: '6543',
        documentTitle: 'Another order from props',
      },
    ];

    const { state } = await runAction(setTodaysOrdersAction, {
      props: {
        todaysOrders: mockTodaysOrdersFromProps,
        totalCount: 17,
      },
      state: {
        todaysOrders: { page: 2, results: mockTodaysOrdersFromState },
      },
    });

    expect(state.todaysOrders.results).toMatchObject([
      ...mockTodaysOrdersFromState,
      ...mockTodaysOrdersFromProps,
    ]);
  });

  it('should set state.todaysOrders.totalCount from props.todaysOrders.totalCount', async () => {
    const { state } = await runAction(setTodaysOrdersAction, {
      props: {
        todaysOrders: [],
        totalCount: 17,
      },
      state: {
        todaysOrders: { results: [] },
      },
    });

    expect(state.todaysOrders.totalCount).toBe(17);
  });

  it('should default state.todaysOrders.page to 1', async () => {
    const { state } = await runAction(setTodaysOrdersAction, {
      props: {
        todaysOrders: [],
      },
      state: {
        todaysOrders: { results: [] },
      },
    });

    expect(state.todaysOrders.page).toBe(2); // we increment this value before setting it in state
  });

  it('should set state.todaysOrders.page to the value in state + 1', async () => {
    const { state } = await runAction(setTodaysOrdersAction, {
      props: {
        todaysOrders: [{ some: 'result' }],
      },
      state: {
        todaysOrders: { page: 4, results: [{ some: 'other' }] },
      },
    });

    expect(state.todaysOrders.page).toBe(5);
    expect(state.todaysOrders.results.length).toBe(2);
  });

  it('should set state.todaysOrders.results to the props.todaysOrders if page is 1', async () => {
    const { state } = await runAction(setTodaysOrdersAction, {
      props: {
        todaysOrders: [{ some: 'result' }],
      },
      state: {
        todaysOrders: { page: 1, results: [{ some: 'other' }] },
      },
    });

    expect(state.todaysOrders.results.length).toBe(1);
    expect(state.todaysOrders.results).toEqual([{ some: 'result' }]);
  });
});
