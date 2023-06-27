import { CASE_STATUS_TYPES } from '../../entities/EntityConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  createEndOfDayISO,
  createStartOfDayISO,
} from '../../utilities/DateHandler';
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

  const mockEndDate = '03/21/2020';
  const mockStartDate = '02/12/2020';

  let [month, day, year] = mockStartDate.split('/');
  const calculatedStartDate = createStartOfDayISO({
    day,
    month,
    year,
  });

  [month, day, year] = mockEndDate.split('/');
  const calculatedEndDate = createEndOfDayISO({
    day,
    month,
    year,
  });

  const mockValidRequest = {
    endDate: calculatedEndDate,
    judgeName: judgeUser.name,
    startDate: calculatedStartDate,
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
        judgeName: judgeUser.name,
        startDate: 'yabbadabbadoo',
      }),
    ).rejects.toThrow();
  });

  it('should return the cases closed organized by status', async () => {
    const result = await getCasesClosedByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().getCasesClosedByJudge.mock
        .calls[0][0],
    ).toMatchObject({
      endDate: calculatedEndDate,
      judgeName: judgeUser.name,
      startDate: calculatedStartDate,
    });

    expect(result).toEqual({
      [CASE_STATUS_TYPES.closed]: 2,
      [CASE_STATUS_TYPES.closedDismissed]: 3,
    });
  });

  it('should not make a call with a specified judge if fetching cases for all judges', async () => {
    mockValidRequest.judgeName = 'All Judges';
    await getCasesClosedByJudgeInteractor(applicationContext, mockValidRequest);

    expect(
      applicationContext.getPersistenceGateway().getCasesClosedByJudge.mock
        .calls[0][0],
    ).toMatchObject(
      expect.objectContaining({
        endDate: calculatedEndDate,
        judgeName: '',
        startDate: calculatedStartDate,
      }),
    );
  });
});
