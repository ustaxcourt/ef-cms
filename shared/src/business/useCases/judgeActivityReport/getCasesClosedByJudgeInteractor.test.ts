import { CASE_STATUS_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  chambersUser,
  judgeUser,
  petitionsClerkUser,
} from '../../../test/mockUsers';
import { getCasesClosedByJudgeInteractor } from './getCasesClosedByJudgeInteractor';

describe('getCasesClosedByJudgeInteractor', () => {
  const mockClosedCases = [
    {
      status: CASE_STATUS_TYPES.closed,
    },
    {
      status: CASE_STATUS_TYPES.closedDismissed,
    },
    {
      status: CASE_STATUS_TYPES.closed,
    },
    {
      status: CASE_STATUS_TYPES.closedDismissed,
    },
    {
      status: CASE_STATUS_TYPES.closedDismissed,
    },
  ];

  const mockValidRequest = {
    endDate: '03/21/2020',
    judgeName: judgeUser.name,
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
      getCasesClosedByJudgeInteractor(applicationContext, mockValidRequest),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return an error when the search parameters are not valid', async () => {
    await expect(
      getCasesClosedByJudgeInteractor(applicationContext, {
        endDate: undefined,
        judgeName: judgeUser.name,
        startDate: 'yabbadabbadoo',
      }),
    ).rejects.toThrow();
  });

  it("should search for closed cases using the current user's name when they are a judge user", async () => {
    await getCasesClosedByJudgeInteractor(applicationContext, mockValidRequest);

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

    await getCasesClosedByJudgeInteractor(applicationContext, mockValidRequest);

    expect(
      applicationContext.getPersistenceGateway().getCasesClosedByJudge.mock
        .calls[0][0].judgeName,
    ).toBe('Colvin');
  });

  it('should return the cases closed organized by status', async () => {
    const result = await getCasesClosedByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result).toEqual({
      [CASE_STATUS_TYPES.closed]: 2,
      [CASE_STATUS_TYPES.closedDismissed]: 3,
    });
  });
});
