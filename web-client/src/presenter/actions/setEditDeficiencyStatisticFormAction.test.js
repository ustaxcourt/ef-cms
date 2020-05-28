import { runAction } from 'cerebral/test';
import { setEditDeficiencyStatisticFormAction } from './setEditDeficiencyStatisticFormAction';

describe('setEditDeficiencyStatisticFormAction', () => {
  it('sets the statistic with the given index onto the form from the state.caseDetail', async () => {
    const result = await runAction(setEditDeficiencyStatisticFormAction, {
      props: { statisticId: '771997ff-ff16-4de6-8143-2b10e6eafe98' },
      state: {
        caseDetail: {
          statistics: [
            {
              irsTotalPenalties: 1,
              statisticId: '771997ff-ff16-4de6-8143-2b10e6eafe98',
            },
          ],
        },
      },
    });
    expect(result.state.form).toEqual({
      irsTotalPenalties: 1,
      statisticId: '771997ff-ff16-4de6-8143-2b10e6eafe98',
    });
  });
});
