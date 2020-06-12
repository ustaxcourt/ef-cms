import { runAction } from 'cerebral/test';
import { setTotalPenaltiesAmountForStatisticAction } from './setTotalPenaltiesAmountForStatisticAction';

describe('setTotalPenaltiesAmountForStatisticAction,', () => {
  it('sets the totalPenalties value for the given index', async () => {
    const result = await runAction(setTotalPenaltiesAmountForStatisticAction, {
      props: {
        totalPenalties: '$112.99',
      },
      state: {
        form: {
          statistics: [
            {
              totalPenalties: '$1.00',
            },
            {
              totalPenalties: '$2.00',
            },
            {
              totalPenalties: '$3.00',
            },
          ],
        },
        modal: {
          statisticIndex: 1,
        },
      },
    });

    expect(result.state.form.statistics).toMatchObject([
      {
        totalPenalties: '$1.00',
      },
      {
        totalPenalties: '$112.99',
      },
      {
        totalPenalties: '$3.00',
      },
    ]);
  });
});
