import { runAction } from '@web-client/presenter/test.cerebral';
import { setEditOtherStatisticsFormAction } from './setEditOtherStatisticsFormAction';

describe('setEditOtherStatisticsFormAction', () => {
  it('sets the damages and litigationCosts onto the form from the state.caseDetail', async () => {
    const result = await runAction(setEditOtherStatisticsFormAction, {
      state: {
        caseDetail: {
          damages: 1,
          litigationCosts: 1,
        },
      },
    });
    expect(result.state.form).toEqual({
      damages: 1,
      isEditing: true,
      litigationCosts: 1,
    });
  });
});
