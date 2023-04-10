import { applicationContext } from '../../test/createTestApplicationContext';
import { generateJudgeActivityReportSearchInteractor } from './generateJudgeActivityReportSearchInteractor';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

describe('generateJudgeActivityReportSearchInteractor', () => {
  const mockClosedCases = [];

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

  it('should return the cases closed in the time period specified in the request by the current user when they are a judge', () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);
    applicationContext
      .getPersistenceGateway()
      .getCasesClosedByJudge.mockReturnValue(mockClosedCases);

    const { closedCases } = generateJudgeActivityReportSearchInteractor(
      applicationContext,
      {
        endDate: '2014-03-21',
        startDate: '2013-12-23',
      },
    );

    expect(closedCases).toBe(mockClosedCases);
  });
});
