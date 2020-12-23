import { runAction } from 'cerebral/test';
import { setTodaysOrdersAction } from './setTodaysOrdersAction';

describe('setTodaysOrdersAction', () => {
  it('should set state.todaysOrders.results from props.todaysOrders.results and state.todaysOrders.results', async () => {
    const mockTodaysOrdersState = [
      {
        docketEntryId: '1234',
        documentTitle: 'An order',
      },
      {
        docketEntryId: '5678',
        documentTitle: 'Another order',
      },
    ];
    const mockTodaysOrdersProps = [
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
        todaysOrders: { results: mockTodaysOrdersProps, totalCount: 17 },
      },
      state: {
        todaysOrders: { results: mockTodaysOrdersState },
      },
    });

    expect(state.todaysOrders.results).toMatchObject([
      ...mockTodaysOrdersState,
      ...mockTodaysOrdersProps,
    ]);
  });

  it('should set state.todaysOrders.totalCount from props.todaysOrders.totalCount', async () => {
    const { state } = await runAction(setTodaysOrdersAction, {
      props: {
        todaysOrders: { results: [], totalCount: 17 },
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
        todaysOrders: { results: [] },
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
        todaysOrders: { results: [] },
      },
      state: {
        todaysOrders: { page: 4, results: [] },
      },
    });

    expect(state.todaysOrders.page).toBe(5);
  });
});
