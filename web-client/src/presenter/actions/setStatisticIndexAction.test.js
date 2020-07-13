import { runAction } from 'cerebral/test';
import { setStatisticIndexAction } from './setStatisticIndexAction';

describe('setStatisticIndexAction,', () => {
  it('sets the statisticsIndex from props', async () => {
    const result = await runAction(setStatisticIndexAction, {
      props: {
        key: 'totalPenalties',
        statisticIndex: 5,
      },
      state: {
        modal: {
          statisticIndex: 1,
        },
      },
    });

    expect(result.state.modal.statisticIndex).toEqual(5);
    expect(result.state.modal.key).toEqual('totalPenalties');
  });
});
