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
          statistics: [
            {
              irsDeficiencyAmount: '123',
              irsTotalPenalties: '123',
              lastDateOfPeriodDay: '1',
              lastDateOfPeriodMonth: '1',
              lastDateOfPeriodYear: '2010',
              year: '2012',
              yearOrPeriod: 'Year',
            },
          ],
        },
      },
    });

    expect(result.state.form).toEqual({
      statistics: [
        {
          yearOrPeriod: 'Year',
        },
      ],
    });
  });

  it('should not unset statistics form values if props.key does not contain yearOrPeriod', async () => {
    const statisticsForm = {
      irsDeficiencyAmount: '123',
      irsTotalPenalties: '123',
      lastDateOfPeriodDay: '1',
      lastDateOfPeriodMonth: '1',
      lastDateOfPeriodYear: '2010',
      year: '2012',
    };
    const result = await runAction(clearStatisticsFormValuesAction, {
      props: {
        key: 'statistics.0.year',
        value: '2012',
      },
      state: {
        form: { statistics: [statisticsForm] },
      },
    });

    expect(result.state.form).toEqual({ statistics: [statisticsForm] });
  });
});
