import { clearTodaysOrdersAction } from './clearTodaysOrdersAction';
import { runAction } from 'cerebral/test';

describe('clearTodaysOrdersAction', () => {
  beforeAll(() => {});

  it('should set state.todaysOrders to an object with an empty results array', async () => {
    const result = await runAction(clearTodaysOrdersAction, {
      state: {
        todaysOrders: {
          results: [{}, {}, {}],
          totalCount: 3,
        },
      },
    });

    expect(result.state.todaysOrders).toEqual({
      results: [],
    });
  });
});
