import { runAction } from 'cerebral/test';
import { setDefaultFormForAddDeficiencySatisticsAction } from './setDefaultFormForAddDeficiencySatisticsAction';

describe('setDefaultFormForAddDeficiencySatisticsAction', () => {
  it('sets state.form.yearOrPeriod to Year as the default value', async () => {
    const { state } = await runAction(
      setDefaultFormForAddDeficiencySatisticsAction,
      {
        state: {},
      },
    );

    expect(state.form.yearOrPeriod).toBe('Year');
  });
});
