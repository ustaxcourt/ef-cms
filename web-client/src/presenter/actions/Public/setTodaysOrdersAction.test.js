import { runAction } from 'cerebral/test';
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
        todaysOrders: { results: mockTodaysOrdersFromState },
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
        todaysOrders: [],
      },
      state: {
        todaysOrders: { page: 4, results: [] },
      },
    });

    expect(state.todaysOrders.page).toBe(5);
  });
});
