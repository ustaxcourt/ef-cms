import { applicationContext } from '../../test/createTestApplicationContext';
import { validateJudgeActivityReportSearchInteractor } from './validateJudgeActivityReportSearchInteractor';

describe('validateJudgeActivityReportSearchInteractor', () => {
  it('should return formatted validation errors when the search criteria are invalid', () => {
    const errors = validateJudgeActivityReportSearchInteractor(
      applicationContext,
      {
        endDate: undefined,
        startDate: undefined,
      },
    );

    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });

  it('should return null when the search criteria are valid', () => {
    const result = validateJudgeActivityReportSearchInteractor(
      applicationContext,
      {
        endDate: '2021-01-23',
        startDate: '2021-01-22',
      },
    );

    expect(result).toEqual(null);
  });
});
