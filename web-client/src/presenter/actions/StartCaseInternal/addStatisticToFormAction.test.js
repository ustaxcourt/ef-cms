import { addStatisticToFormAction } from './addStatisticToFormAction';
import { runAction } from 'cerebral/test';

describe('addStatisticToFormAction', () => {
  it('should add a statistic to the form.statistics array', async () => {
    const result = await runAction(addStatisticToFormAction, {
      state: {
        form: { statistics: [{ yearOrPeriod: 'Period' }] },
      },
    });

    expect(result.state.form.statistics.length).toEqual(2);
    expect(result.state.form.statistics[1]).toEqual({ yearOrPeriod: 'Year' });
  });

  it('should not add a statistic to the form.statistics array if its length is greater than 12', async () => {
    const manyStatistics = [];
    for (let i = 0; i < 12; i++) {
      manyStatistics.push({ yearOrPeriod: 'Period' });
    }
    const result = await runAction(addStatisticToFormAction, {
      state: {
        form: { statistics: manyStatistics },
      },
    });

    expect(result.state.form.statistics.length).toEqual(12);
  });

  it('should default form.statistics to an array if it is not present on the form', async () => {
    const result = await runAction(addStatisticToFormAction, {
      state: {
        form: {},
      },
    });

    expect(result.state.form.statistics.length).toEqual(1);
  });
});
