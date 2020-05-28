import { runAction } from 'cerebral/test';
import { setEditDeficiencyStatisticFormAction } from './setEditDeficiencyStatisticFormAction';

describe('setEditDeficiencyStatisticFormAction', () => {
  it('sets the statistic with the given index onto the form from the state.caseDetail', async () => {
    const result = await runAction(setEditDeficiencyStatisticFormAction, {
      props: { statisticIndex: 0 },
      state: {
        caseDetail: {
          statistics: [{ irsTotalPenalties: 1 }],
        },
      },
    });
    expect(result.state.form).toEqual({
      irsTotalPenalties: 1,
      statisticIndex: 0,
    });
  });
});
