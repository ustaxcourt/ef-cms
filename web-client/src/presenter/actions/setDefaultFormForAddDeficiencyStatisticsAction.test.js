import { runAction } from 'cerebral/test';
import { setDefaultFormForAddDeficiencyStatisticsAction } from './setDefaultFormForAddDeficiencyStatisticsAction';

describe('setDefaultFormForAddDeficiencyStatisticsAction', () => {
  it('sets state.form.yearOrPeriod to Year as the default value', async () => {
    const { state } = await runAction(
      setDefaultFormForAddDeficiencyStatisticsAction,
      {
        state: {},
      },
    );

    expect(state.form.yearOrPeriod).toBe('Year');
  });
});
