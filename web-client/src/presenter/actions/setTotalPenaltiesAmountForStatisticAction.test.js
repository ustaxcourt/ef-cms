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
              irsTotalPenalties: '$1.00',
            },
            {
              irsTotalPenalties: '$2.00',
            },
            {
              irsTotalPenalties: '$3.00',
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
        irsTotalPenalties: '$1.00',
      },
      {
        irsTotalPenalties: '$112.99',
      },
      {
        irsTotalPenalties: '$3.00',
      },
    ]);
  });
});
