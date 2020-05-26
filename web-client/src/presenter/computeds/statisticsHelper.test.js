import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runCompute } from 'cerebral/test';
import { statisticsHelper as statisticsHelperComputed } from './statisticsHelper';
import { withAppContextDecorator } from '../../withAppContext';

const statisticsHelper = withAppContextDecorator(
  statisticsHelperComputed,
  applicationContext,
);

describe('statisticsHelper', () => {
  it('formats statistics with formatted dates and money', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          damages: 1234.56,
          litigationCosts: 9,
          statistics: [
            {
              irsDeficiencyAmount: 123,
              irsTotalPenalties: 30000,
              year: '2012',
              yearOrPeriod: 'Year',
            },
            {
              determinationDeficiencyAmount: 1234,
              determinationTotalPenalties: 33.45,
              irsDeficiencyAmount: 0,
              irsTotalPenalties: 21,
              lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
              yearOrPeriod: 'Period',
            },
          ],
        },
      },
    });

    expect(result).toMatchObject({
      formattedDamages: '$1,234.56',
      formattedLitigationCosts: '$9.00',
      formattedStatistics: [
        {
          formattedDate: '2012',
          formattedDeterminationDeficiencyAmount: 'TBD',
          formattedDeterminationTotalPenalties: 'TBD',
          formattedIrsDeficiencyAmount: '$123.00',
          formattedIrsTotalPenalties: '$30,000.00',
        },
        {
          formattedDate: '03/01/19',
          formattedDeterminationDeficiencyAmount: '$1,234.00',
          formattedDeterminationTotalPenalties: '$33.45',
          formattedIrsDeficiencyAmount: '$0.00',
          formattedIrsTotalPenalties: '$21.00',
        },
      ],
      showOtherStatistics: true,
    });
  });

  it('returns undefined formattedStatistics if caseDetail.statistics is length 0', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          statistics: [],
        },
      },
    });

    expect(result.formattedStatistics).toBeUndefined();
  });

  it('returns undefined values if caseDetail.statistics, damages, and litigationCosts are undefined', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {},
      },
    });

    expect(result).toEqual({
      showOtherStatistics: false,
    });
  });
});
