import { runAction } from 'cerebral/test';
import { setTotalPenaltiesAmountForAddStatisticAction } from './setTotalPenaltiesAmountForAddStatisticAction';

describe('setTotalPenaltiesAmountForAddStatisticAction,', () => {
  it('sets the totalPenalties value for the given index', async () => {
    const result = await runAction(
      setTotalPenaltiesAmountForAddStatisticAction,
      {
        props: {
          totalPenalties: '$112.99',
        },
        state: {
          form: {},
          modal: {
            key: 'totalPenalties',
          },
        },
      },
    );

    expect(result.state.form.totalPenalties).toEqual('$112.99');
  });
});
