import { applicationContext } from '../../test/createTestApplicationContext';
import {
  chambersUser,
  judgeUser,
  petitionsClerkUser,
} from '../../../test/mockUsers';
import { generateJudgeActivityReportInteractor } from './generateJudgeActivityReportInteractor';

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

    applicationContext
      .getPersistenceGateway()
      .getCasesClosedByJudge.mockResolvedValue(mockClosedCases);
  });

  it('should return an error when the user is not authorized to generate the report', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionsClerkUser);

    await expect(
      generateJudgeActivityReportInteractor(
        applicationContext,
        mockValidRequest,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return an error when the search parameters are not valid', async () => {
    await expect(
      generateJudgeActivityReportInteractor(applicationContext, {
        endDate: undefined,
        startDate: 'yabbadabbadoo',
      }),
    ).rejects.toThrow();
  });

  it("should search for closed cases using the current user's name when they are a judge user", async () => {
    await generateJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().getCasesClosedByJudge.mock
        .calls[0][0].judgeName,
    ).toBe(judgeUser.name);
  });

  it('should search for closed cases using the judge name of the section of the current when they are a chambers user', async () => {
    applicationContext.getCurrentUser.mockReturnValue(chambersUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(chambersUser);

    await generateJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().getCasesClosedByJudge.mock
        .calls[0][0].judgeName,
    ).toBe('Colvin');
  });

  it('should return the cases closed in the time period specified in the request by the current user when they are a judge', async () => {
    const { closedCases } = await generateJudgeActivityReportInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(closedCases).toEqual(mockClosedCases);
  });
});
