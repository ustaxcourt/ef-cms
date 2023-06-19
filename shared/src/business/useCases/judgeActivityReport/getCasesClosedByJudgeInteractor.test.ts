import { CASE_STATUS_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { getCasesClosedByJudgeInteractor } from './getCasesClosedByJudgeInteractor';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

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

  const judgesSelection = ['Colvin', 'Samson'];

  const mockStartDate = '02/12/2020';
  const mockEndDate = '03/21/2020';

  const mockValidRequest = {
    endDate: mockEndDate,
    judgesSelection,
    startDate: mockStartDate,
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
        endDate: 'baddabingbaddaboom',
        judgesSelection: [],
        startDate: 'yabbadabbadoo',
      }),
    ).rejects.toThrow();

    await expect(
      getCasesClosedByJudgeInteractor(applicationContext, {
        endDate: mockEndDate,
        judgesSelection: [],
        startDate: mockStartDate,
      }),
    ).rejects.toThrow();
  });

  it('should return the cases closed organized by status(es) for the selected judge(s)', async () => {
    const result = await getCasesClosedByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(result).toEqual({
      [CASE_STATUS_TYPES.closed]: 4,
      [CASE_STATUS_TYPES.closedDismissed]: 6,
    });
  });
});
