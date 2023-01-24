import { runAction } from 'cerebral/test';
import { setTotalPenaltiesAmountForStatisticAction } from './setTotalPenaltiesAmountForStatisticAction';

describe('setTotalPenaltiesAmountForStatisticAction,', () => {
  const key = 'irsTotalPenalties';
  const statisticIndex = 0;
  const sumOfPenalties = '$112.99';
  const penalties = [
    {
      irsTotalPenalties: '$1.00',
    },
    {
      irsTotalPenalties: '$2.00',
    },
    {
      irsTotalPenalties: '$3.00',
    },
  ];

  it('sets sumOfPenalties and penalties on the proper state when statisticIndex is defined and a number', async () => {
    const { state } = await runAction(
      setTotalPenaltiesAmountForStatisticAction,
      {
        props: {
          penalties,
          sumOfPenalties,
        },
        state: {
          form: {},
          modal: {
            key,
            statisticIndex,
          },
        },
      },
    );

    expect(state.form.statistics[statisticIndex].penalties).toEqual(penalties);
    expect(state.form.statistics[statisticIndex][key]).toEqual(sumOfPenalties);
  });

  it('sets sumOfPenalties and penalties on the proper state when statisticIndex is undefined', async () => {
    const { state } = await runAction(
      setTotalPenaltiesAmountForStatisticAction,
      {
        props: {
          penalties,
          sumOfPenalties,
        },
        state: {
          form: {},
          modal: {
            key,
            statisticIndex: undefined,
          },
        },
      },
    );

    expect(state.form.penalties).toEqual(penalties);
    expect(state.form[key]).toEqual(sumOfPenalties);
  });
});
