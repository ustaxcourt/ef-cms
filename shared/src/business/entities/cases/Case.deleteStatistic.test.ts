const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('deleteStatistic', () => {
  it('should successfully delete a statistic', () => {
    const statistic0Id = 'cc0f6102-3537-4047-b951-74c21b1aab76';
    const statistic1Id = 'f4c00a75-f6d9-4e63-9cc7-ca1deee8a949';
    const originalStatistics = [
      {
        determinationDeficiencyAmount: 1,
        determinationTotalPenalties: 1,
        irsDeficiencyAmount: 1,
        irsTotalPenalties: 1,
        statisticId: statistic0Id,
        year: 2012,
        yearOrPeriod: 'Year',
      },
      {
        determinationDeficiencyAmount: 2,
        determinationTotalPenalties: 2,
        irsDeficiencyAmount: 2,
        irsTotalPenalties: 2,
        statisticId: statistic1Id,
        year: 2013,
        yearOrPeriod: 'Year',
      },
    ];

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        statistics: originalStatistics,
      },
      { applicationContext },
    );

    caseEntity.deleteStatistic(statistic0Id);

    expect(caseEntity.statistics.length).toEqual(1);
    expect(caseEntity.statistics[0].statisticId).toEqual(statistic1Id);
  });

  it('should not delete a statistic if its statisticId is not present on the case', () => {
    const statistic0Id = 'cc0f6102-3537-4047-b951-74c21b1aab76';
    const statistic1Id = 'f4c00a75-f6d9-4e63-9cc7-ca1deee8a949';
    const originalStatistics = [
      {
        determinationDeficiencyAmount: 1,
        determinationTotalPenalties: 1,
        irsDeficiencyAmount: 1,
        irsTotalPenalties: 1,
        statisticId: statistic0Id,
        year: 2012,
        yearOrPeriod: 'Year',
      },
      {
        determinationDeficiencyAmount: 2,
        determinationTotalPenalties: 2,
        irsDeficiencyAmount: 2,
        irsTotalPenalties: 2,
        statisticId: statistic1Id,
        year: 2013,
        yearOrPeriod: 'Year',
      },
    ];

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        statistics: originalStatistics,
      },
      { applicationContext },
    );

    caseEntity.deleteStatistic('16fc02bc-f00a-453c-a19c-e5597a8850ba');

    expect(caseEntity.statistics.length).toEqual(2);
  });
});
