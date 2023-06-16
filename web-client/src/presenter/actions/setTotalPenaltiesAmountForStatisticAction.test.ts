import { runAction } from '@web-client/presenter/test.cerebral';
import { setTotalPenaltiesAmountForStatisticAction } from './setTotalPenaltiesAmountForStatisticAction';

describe('setTotalPenaltiesAmountForStatisticAction,', () => {
  const key = 'irsTotalPenalties';
  const statisticIndex = 0;
  const sumOfPenalties = '$112.99';
  const allPenalties = [
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
          allPenalties,
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

    expect(state.form.statistics[statisticIndex].penalties).toEqual(
      allPenalties,
    );
    expect(state.form.statistics[statisticIndex][key]).toEqual(sumOfPenalties);
  });

  it('sets sumOfPenalties and penalties on the proper state when statisticIndex is undefined', async () => {
    const { state } = await runAction(
      setTotalPenaltiesAmountForStatisticAction,
      {
        props: {
          allPenalties,
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

    expect(state.form.penalties).toEqual(allPenalties);
    expect(state.form[key]).toEqual(sumOfPenalties);
  });
});
