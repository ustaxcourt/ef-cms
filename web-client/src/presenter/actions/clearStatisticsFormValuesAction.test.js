import { clearStatisticsFormValuesAction } from './clearStatisticsFormValuesAction';
import { runAction } from 'cerebral/test';

describe('clearStatisticsFormValuesAction', () => {
  it('should unset statistics form values if props.key contains yearOrPeriod', async () => {
    const result = await runAction(clearStatisticsFormValuesAction, {
      props: {
        key: 'statistics.0.yearOrPeriod',
        value: 'Year',
      },
      state: {
        form: {
          deficiencyAmount: '123',
          lastDateOfPeriodDay: '1',
          lastDateOfPeriodMonth: '1',
          lastDateOfPeriodYear: '2010',
          totalPenalties: '123',
          year: '2012',
        },
      },
    });

    expect(result.state.form).toEqual({});
  });

  it('should not unset statistics form values if props.key does not contain yearOrPeriod', async () => {
    const statisticsForm = {
      deficiencyAmount: '123',
      lastDateOfPeriodDay: '1',
      lastDateOfPeriodMonth: '1',
      lastDateOfPeriodYear: '2010',
      totalPenalties: '123',
      year: '2012',
    };
    const result = await runAction(clearStatisticsFormValuesAction, {
      props: {
        key: 'statistics.0.year',
        value: '2012',
      },
      state: {
        form: statisticsForm,
      },
    });

    expect(result.state.form).toEqual(statisticsForm);
  });
});
