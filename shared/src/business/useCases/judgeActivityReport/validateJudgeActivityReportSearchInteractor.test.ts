import { applicationContext } from '../test/createTestApplicationContext';
import { validateJudgeActivityReportSearchInteractor } from './validateJudgeActivityReportSearchInteractor';

describe('validateJudgeActivityReportSearchInteractor', () => {
  it('returns the expected errors object on an empty statistic', () => {
    const errors = validateJudgeActivityReportSearchInteractor(
      applicationContext,
      {
        deadlineSearch: {},
      },
    );

    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });

  it('returns null when there are no errors', () => {
    const result = validateJudgeActivityReportSearchInteractor(
      applicationContext,
      {
        deadlineSearch: {
          endDate: '01/02/2020',
          startDate: '01/01/2020',
        },
      },
    );

    expect(result).toEqual(null);
  });
});
