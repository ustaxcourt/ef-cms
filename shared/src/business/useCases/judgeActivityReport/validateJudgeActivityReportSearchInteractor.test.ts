import { judgeUser } from '../../../test/mockUsers';
import { validateJudgeActivityReportSearchInteractor } from './validateJudgeActivityReportSearchInteractor';

describe('validateJudgeActivityReportSearchInteractor', () => {
  it('should return formatted validation errors when the search criteria are invalid', () => {
    const errors = validateJudgeActivityReportSearchInteractor({
      endDate: 'yabbadabaadoooooo',
      judgeName: judgeUser.name,
      startDate: 'NOT_A_DATE',
    });

    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });

  it('should return null when the search criteria are valid', () => {
    const result = validateJudgeActivityReportSearchInteractor({
      endDate: '06/07/2022',
      judgeName: judgeUser.name,
      startDate: '05/02/2022',
    });

    expect(result).toEqual(null);
  });
});
