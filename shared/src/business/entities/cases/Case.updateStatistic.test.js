const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { Statistic } = require('../Statistic');

describe('updateStatistic', () => {
  it('should successfully update a statistic', () => {
    const statisticId = '2db9f2b6-d65b-4f71-8ddc-c218d0787e15';

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        statistics: [
          {
            determinationDeficiencyAmount: 567,
            determinationTotalPenalties: 789,
            irsDeficiencyAmount: 11.2,
            irsTotalPenalties: 66.87,
            statisticId,
            year: 2012,
            yearOrPeriod: 'Year',
          },
        ],
      },
      { applicationContext },
    );

    const statisticToUpdate = new Statistic(
      {
        determinationDeficiencyAmount: 1,
        determinationTotalPenalties: 1,
        irsDeficiencyAmount: 1,
        irsTotalPenalties: 1,
        statisticId,
        year: 2012,
        yearOrPeriod: 'Year',
      },
      { applicationContext },
    );

    caseEntity.updateStatistic(statisticToUpdate, statisticId);

    expect(caseEntity.statistics.length).toEqual(1);
    expect(caseEntity.statistics[0]).toEqual(statisticToUpdate);
  });

  it('should not update a statistic if its id is not present on the case', () => {
    const originalStatistic = {
      determinationDeficiencyAmount: 567,
      determinationTotalPenalties: 789,
      irsDeficiencyAmount: 11.2,
      irsTotalPenalties: 66.87,
      statisticId: '2db9f2b6-d65b-4f71-8ddc-c218d0787e15',
      year: 2012,
      yearOrPeriod: 'Year',
    };

    const caseEntity = new Case(
      {
        ...MOCK_CASE,
        statistics: [originalStatistic],
      },
      { applicationContext },
    );

    const statisticToUpdate = new Statistic(
      {
        determinationDeficiencyAmount: 1,
        determinationTotalPenalties: 1,
        irsDeficiencyAmount: 1,
        irsTotalPenalties: 1,
        statisticId: '9f23dac6-4a9d-4e66-aafc-b6d3c892d907',
        year: 2012,
        yearOrPeriod: 'Year',
      },
      { applicationContext },
    );

    caseEntity.updateStatistic(
      statisticToUpdate,
      '9f23dac6-4a9d-4e66-aafc-b6d3c892d907',
    );

    expect(caseEntity.statistics.length).toEqual(1);
    expect(caseEntity.statistics[0]).toMatchObject(originalStatistic);
  });
});
