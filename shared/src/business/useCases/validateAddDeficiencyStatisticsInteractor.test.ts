import { applicationContext } from '../test/createTestApplicationContext';
import { validateAddDeficiencyStatisticsInteractor } from './validateAddDeficiencyStatisticsInteractor';

describe('validateAddDeficiencyStatisticsInteractor', () => {
  it('should return validation errors when the statistic is empty', () => {
    const errors = validateAddDeficiencyStatisticsInteractor(
      applicationContext,
      {
        statistic: {},
      },
    );

    expect(errors).not.toBeNull();
  });

  it('should return null when the statistic is valid', () => {
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
