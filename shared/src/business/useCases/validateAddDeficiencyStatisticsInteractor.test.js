const {
  validateAddDeficiencyStatisticsInteractor,
} = require('./validateAddDeficiencyStatisticsInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');

describe('validateAddDeficiencyStatisticsInteractor', () => {
  it('returns the expected errors object on an empty statistic', () => {
    const errors = validateAddDeficiencyStatisticsInteractor(
      applicationContext,
      {
        statistic: {},
      },
    );

    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });

  it('returns null when there are no errors', () => {
    const result = validateAddDeficiencyStatisticsInteractor(
      applicationContext,
      {
        statistic: {
          irsDeficiencyAmount: 100,
          irsTotalPenalties: 100,
          lastDateOfPeriod: '2020-01-01T02:04:06.007Z',
          yearOrPeriod: 'Period',
        },
      },
    );

    expect(result).toEqual(null);
  });
});
