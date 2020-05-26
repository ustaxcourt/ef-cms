import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formattedStatistics as formattedStatisticsComputed } from './formattedStatistics';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const formattedStatistics = withAppContextDecorator(
  formattedStatisticsComputed,
  applicationContext,
);

describe('formattedStatistics', () => {
  it('formats statistics with formatted dates and money', () => {
    const result = runCompute(formattedStatistics, {
      state: {
        caseDetail: {
          statistics: [
            {
              irsDeficiencyAmount: 123,
              irsTotalPenalties: 30000,
              year: '2012',
              yearOrPeriod: 'Year',
            },
            {
              irsDeficiencyAmount: 0,
              irsTotalPenalties: 21,
              lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
              yearOrPeriod: 'Period',
            },
          ],
        },
      },
    });

    expect(result).toMatchObject([
      {
        formattedDate: '2012',
        formattedIrsDeficiencyAmount: '$123.00',
        formattedIrsTotalPenalties: '$30,000.00',
      },
      {
        formattedDate: '03/01/19',
        formattedIrsDeficiencyAmount: '$0.00',
        formattedIrsTotalPenalties: '$21.00',
      },
    ]);
  });

  it('returns undefined if caseDetail.statistics is length 0', () => {
    const result = runCompute(formattedStatistics, {
      state: {
        caseDetail: {
          statistics: [],
        },
      },
    });

    expect(result).toBeUndefined();
  });

  it('returns undefined if caseDetail.statistics is undefined', () => {
    const result = runCompute(formattedStatistics, {
      state: {
        caseDetail: {},
      },
    });

    expect(result).toBeUndefined();
  });
});
