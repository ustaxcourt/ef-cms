import { applicationContext } from '../../test/createTestApplicationContext';
import { generateJudgeActivityReportInteractor } from './generateJudgeActivityReportInteractor';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

describe('generateJudgeActivityReportInteractor', () => {
  const mockClosedCases = [];

  const mockValidRequest = {
    endDate: '03/21/2020',
    startDate: '02/12/2020',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(judgeUser);
  });

  it('should return an error when the user is not authorized to generate the report', () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    expect(() =>
      generateJudgeActivityReportInteractor(
        applicationContext,
        mockValidRequest,
      ),
    ).toThrow('Unauthorized');
  });

  it('should return an error when the search parameters are not valid', () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    expect(() =>
      generateJudgeActivityReportInteractor(applicationContext, {
        endDate: undefined,
        startDate: 'yabbadabbadoo',
      }),
    ).toThrow();
  });

  it.only('should return the cases closed in the time period specified in the request by the current user when they are a judge', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesClosedByJudge.mockReturnValue(mockClosedCases);

    const { closedCases } = await generateJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(closedCases).toBe(mockClosedCases);
    expect(
      applicationContext.getPersistenceGateway().getCasesClosedByJudge.mock
        .calls[0][0].judge,
    ).toBe('Sotomayor');
  });
});
