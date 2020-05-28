import { runAction } from 'cerebral/test';
import { setEditOtherStatisticsFormAction } from './setEditOtherStatisticsFormAction';

describe('setEditOtherStatisticsFormAction', () => {
  it('adds the props.field key to state.fieldOrder', async () => {
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
      litigationCosts: 1,
    });
  });
});
