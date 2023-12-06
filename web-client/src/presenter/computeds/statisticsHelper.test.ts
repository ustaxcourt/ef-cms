import { CASE_TYPES_MAP } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
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
        permissions: {},
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
    });
  });

  it('returns an editStatisticLink with each formatted statistic', () => {
    const DOCKET_NUMBER = '101-20';
    const STATISTIC_ID_1 = '7b6603d6-bef4-43e1-b013-b7f7fd340fa5';
    const STATISTIC_ID_2 = '8594c82e-fb41-45c5-bb3b-637afb985342';

    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          docketNumber: DOCKET_NUMBER,
          statistics: [
            {
              irsDeficiencyAmount: 123,
              irsTotalPenalties: 30000,
              statisticId: STATISTIC_ID_1,
              year: '2012',
              yearOrPeriod: 'Year',
            },
            {
              determinationDeficiencyAmount: 1234,
              determinationTotalPenalties: 33.45,
              irsDeficiencyAmount: 0,
              irsTotalPenalties: 21,
              lastDateOfPeriod: '2019-03-01T21:40:46.415Z',
              statisticId: STATISTIC_ID_2,
              yearOrPeriod: 'Period',
            },
          ],
        },
        permissions: {},
      },
    });

    expect(result).toMatchObject({
      formattedStatistics: [
        {
          editStatisticLink: `/case-detail/${DOCKET_NUMBER}/edit-deficiency-statistic/${STATISTIC_ID_1}`,
        },
        {
          editStatisticLink: `/case-detail/${DOCKET_NUMBER}/edit-deficiency-statistic/${STATISTIC_ID_2}`,
        },
      ],
    });
  });

  it('sorts formatted statistics by year / lastDateOfPeriod', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          statistics: [
            { year: 2012, yearOrPeriod: 'Year' },
            { year: 2011, yearOrPeriod: 'Year' },
            { year: 2010, yearOrPeriod: 'Year' },
            {
              lastDateOfPeriod: '2019-12-02T12:00:00.000Z',
              yearOrPeriod: 'Period',
            },
            { year: 2013, yearOrPeriod: 'Year' },
            {
              lastDateOfPeriod: '2011-11-01T12:00:00.000Z',
              yearOrPeriod: 'Period',
            },
          ],
        },
        permissions: {},
      },
    });

    expect(result.formattedStatistics).toMatchObject([
      { formattedDate: 2010 },
      { formattedDate: '11/01/11' },
      { formattedDate: 2011 },
      { formattedDate: 2012 },
      { formattedDate: 2013 },
      { formattedDate: '12/02/19' },
    ]);
  });

  it('returns undefined formattedStatistics if caseDetail.statistics is length 0', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          statistics: [],
        },
        permissions: {},
      },
    });

    expect(result.formattedStatistics).toBeUndefined();
  });

  it('returns undefined values if caseDetail.statistics, damages, and litigationCosts are undefined', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {},
        permissions: {},
      },
    });

    expect(result).toMatchObject({
      formattedDamages: undefined,
      formattedLitigationCosts: undefined,
      formattedStatistics: undefined,
    });
  });

  it('returns showAddDeficiencyStatisticsButton true if permissions.ADD_EDIT_STATISTICS is true and case type is deficiency', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          caseType: CASE_TYPES_MAP.deficiency,
        },
        permissions: {
          ADD_EDIT_STATISTICS: true,
        },
      },
    });

    expect(result).toMatchObject({
      showAddButtons: true,
      showAddDeficiencyStatisticsButton: true,
    });
  });

  it('returns showAddDeficiencyStatisticsButton false if permissions.ADD_EDIT_STATISTICS is false and case type is deficiency', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          caseType: CASE_TYPES_MAP.deficiency,
        },
        permissions: {
          ADD_EDIT_STATISTICS: false,
        },
      },
    });

    expect(result).toMatchObject({
      showAddButtons: false,
      showAddDeficiencyStatisticsButton: false,
    });
  });

  it('returns showAddDeficiencyStatisticsButton false if permissions.ADD_EDIT_STATISTICS is true and case type is not deficiency', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          caseType: CASE_TYPES_MAP.cdp,
        },
        permissions: {
          ADD_EDIT_STATISTICS: true,
        },
      },
    });

    expect(result).toMatchObject({
      showAddButtons: true,
      showAddDeficiencyStatisticsButton: false,
    });
  });

  it('returns showAddDeficiencyStatisticsButton false if the maximum number of statistics for a case has been reached', () => {
    const statisticsWithMaxLength = new Array(12); // 12 is the maximum number of statistics

    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          caseType: CASE_TYPES_MAP.deficiency,
          statistics: statisticsWithMaxLength,
        },
        permissions: {
          ADD_EDIT_STATISTICS: true,
        },
      },
    });

    expect(result).toMatchObject({
      showAddButtons: true,
      showAddDeficiencyStatisticsButton: false,
    });
  });

  it('returns showAddOtherStatisticsButton true if permissions.ADD_EDIT_STATISTICS is true and other statistics are not already added', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {},
        permissions: {
          ADD_EDIT_STATISTICS: true,
        },
      },
    });

    expect(result).toMatchObject({
      showAddButtons: true,
      showAddOtherStatisticsButton: true,
    });
  });

  it('returns showAddOtherStatisticsButton false if permissions.ADD_EDIT_STATISTICS is true and other statistics are already added', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          litigationCosts: 1234,
        },
        permissions: {
          ADD_EDIT_STATISTICS: true,
        },
      },
    });

    expect(result).toMatchObject({
      showAddButtons: false,
      showAddOtherStatisticsButton: false,
    });
  });

  it('returns showEditButtons false if permissions.ADD_EDIT_STATISTICS is false', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {},
        permissions: {
          ADD_EDIT_STATISTICS: false,
        },
      },
    });

    expect(result.showEditButtons).toEqual(false);
  });

  it('returns showEditButtons true if permissions.ADD_EDIT_STATISTICS is true', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {},
        permissions: {
          ADD_EDIT_STATISTICS: true,
        },
      },
    });

    expect(result.showEditButtons).toEqual(true);
  });

  it('returns showNoStatistics true if there are no statistics on the case', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {},
        permissions: {},
      },
    });

    expect(result.showNoStatistics).toEqual(true);
  });

  it('returns showNoStatistics false if there are statistics on the case', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          statistics: [
            {
              irsDeficiencyAmount: 123,
              irsTotalPenalties: 30000,
              year: '2012',
              yearOrPeriod: 'Year',
            },
          ],
        },
        permissions: {},
      },
    });

    expect(result.showNoStatistics).toEqual(false);
  });

  it('returns showNoStatistics false if there are damages on the case', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          damages: 1234,
        },
        permissions: {},
      },
    });

    expect(result.showNoStatistics).toEqual(false);
  });

  it('returns showOtherStatistics false if there are no damages or litigationCosts on the case', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {},
        permissions: {},
      },
    });

    expect(result.showOtherStatistics).toEqual(false);
  });

  it('returns showDamages and showOtherStatistics true if there are damages on the case', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          damages: 1234,
        },
        permissions: {},
      },
    });

    expect(result.showOtherStatistics).toEqual(true);
    expect(result.showDamages).toEqual(true);
  });

  it('returns showLitigationCosts showOtherStatistics true if there are damages on the case', () => {
    const result = runCompute(statisticsHelper, {
      state: {
        caseDetail: {
          litigationCosts: 1234,
        },
        permissions: {},
      },
    });

    expect(result.showOtherStatistics).toEqual(true);
    expect(result.showLitigationCosts).toEqual(true);
  });
});
