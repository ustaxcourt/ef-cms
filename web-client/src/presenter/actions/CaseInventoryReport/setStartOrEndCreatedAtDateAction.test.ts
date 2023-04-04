import { runAction } from 'cerebral/test';
import { setStartOrEndCreatedAtDateAction } from './setStartOrEndCreatedAtDateAction';

describe('setStartOrEndCreatedAtDateAction', () => {
  it('should set customCaseInventoryFilters createStartDate in state', async () => {
    const someDate = '2019-05-14T04:00:00.000Z';

    const result = await runAction(setStartOrEndCreatedAtDateAction, {
      props: {
        date: someDate,
        startOrEnd: 'start',
      },
    });

    expect(result.state.customCaseInventoryFilters.createStartDate).toEqual(
      someDate,
    );
  });

  it('should set customCaseInventoryFilters createEndDate in state', async () => {
    const someDate = '2019-05-14T04:00:00.000Z';

    const result = await runAction(setStartOrEndCreatedAtDateAction, {
      props: {
        date: someDate,
        startOrEnd: 'end',
      },
    });

    expect(result.state.customCaseInventoryFilters.createEndDate).toEqual(
      someDate,
    );
  });
});
