import { runAction } from '@web-client/presenter/test.cerebral';
import { setStatisticIndexAction } from './setStatisticIndexAction';

describe('setStatisticIndexAction,', () => {
  it('sets the statisticsIndex on state from props', async () => {
    const result = await runAction(setStatisticIndexAction, {
      props: {
        key: 'totalPenalties',
        statisticIndex: 5,
        subkey: 'irsPenaltyAmount',
      },
      state: {
        modal: {},
      },
    });

    expect(result.state.modal.statisticIndex).toEqual(5);
    expect(result.state.modal.key).toEqual('totalPenalties');
    expect(result.state.modal.subkey).toEqual('irsPenaltyAmount');
  });

  it('does not set the statisticsIndex on state from props if statisticIndex is undefined', async () => {
    const result = await runAction(setStatisticIndexAction, {
      props: {
        key: 'totalPenalties',
        statisticIndex: undefined,
        subkey: 'irsPenaltyAmount',
      },
      state: {
        modal: {},
      },
    });

    expect(result.state.modal.key).toEqual('totalPenalties');
    expect(result.state.modal.subkey).toEqual('irsPenaltyAmount');
  });
});
