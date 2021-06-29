const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { Statistic } = require('../Statistic');

describe('addStatistic', () => {
  it('should successfully add a statistic', () => {
    const caseEntity = new Case(MOCK_CASE, { applicationContext });

    const statisticToAdd = new Statistic(
      {
        determinationDeficiencyAmount: 567,
        determinationTotalPenalties: 789,
        irsDeficiencyAmount: 11.2,
        irsTotalPenalties: 66.87,
        year: 2012,
        yearOrPeriod: 'Year',
      },
      { applicationContext },
    );

    caseEntity.addStatistic(statisticToAdd);

    expect(caseEntity.statistics.length).toEqual(1);
  });

  it('should throw an error if the max number of statistics for a case has already been reached', () => {
    const statisticsWithMaxLength = new Array(12); // 12 is the maximum number of statistics
    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        statistics: statisticsWithMaxLength,
      },
      { applicationContext },
    );

    const statisticToAdd = new Statistic(
      {
        determinationDeficiencyAmount: 567,
        determinationTotalPenalties: 789,
        irsDeficiencyAmount: 11.2,
        irsTotalPenalties: 66.87,
        year: 2012,
        yearOrPeriod: 'Year',
      },
      { applicationContext },
    );

    let error;
    try {
      caseEntity.addStatistic(statisticToAdd);
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.toString()).toEqual(
      'Error: maximum number of statistics reached',
    );
    expect(caseEntity.statistics.length).toEqual(12);
  });
});
