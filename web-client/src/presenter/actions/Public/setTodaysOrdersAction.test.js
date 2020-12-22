import { runAction } from 'cerebral/test';
import { setTodaysOrdersAction } from './setTodaysOrdersAction';

describe('setTodaysOrdersAction', () => {
  it('sets state.todaysOpions from props.todaysOrders', async () => {
    const mockTodaysOrders = [
      {
        docketEntryId: '1234',
        documentTitle: 'An order',
      },
      {
        docketEntryId: '5678',
        documentTitle: 'Another order',
      },
    ];

    const { state } = await runAction(setTodaysOrdersAction, {
      props: {
        todaysOrders: mockTodaysOrders,
      },
      state: {
        todaysOrders: [],
      },
    });

    expect(state.todaysOrders).toMatchObject(mockTodaysOrders);
  });
});
