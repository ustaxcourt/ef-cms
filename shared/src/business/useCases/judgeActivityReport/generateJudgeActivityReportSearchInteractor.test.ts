import { applicationContext } from '../../test/createTestApplicationContext';
import { generateJudgeActivityReportSearchInteractor } from './generateJudgeActivityReportSearchInteractor';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

describe('generateJudgeActivityReportSearchInteractor', () => {
  it('should return an error when the user is not authorized to generate the report', () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    expect(() =>
      generateJudgeActivityReportSearchInteractor(applicationContext, {}),
    ).toThrow('Unauthorized');
  });

  it('should return an error when the search parameters are not valid', () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    expect(() =>
      generateJudgeActivityReportSearchInteractor(applicationContext, {
        endDate: undefined,
        startDate: 'yabbadabbadoo',
      }),
    ).toThrow();
  });
});
