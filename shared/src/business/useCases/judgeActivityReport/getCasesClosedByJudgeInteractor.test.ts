import { CASE_STATUS_TYPES } from '../../entities/EntityConstants';
import {
  CasesClosedType,
  JudgeActivityReportFilters,
} from '@web-client/presenter/judgeActivityReportState';
import { applicationContext } from '../../test/createTestApplicationContext';
import {
  createEndOfDayISO,
  createStartOfDayISO,
} from '../../utilities/DateHandler';
import { getCasesClosedByJudgeInteractor } from './getCasesClosedByJudgeInteractor';
import { judgeUser, petitionsClerkUser } from '../../../test/mockUsers';

describe('getCasesClosedByJudgeInteractor', () => {
  const mockReturnedCloseCases: CasesClosedType = {
    [CASE_STATUS_TYPES.closed]: 3,
    [CASE_STATUS_TYPES.closedDismissed]: 2,
  };

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

  const mockValidRequest: JudgeActivityReportFilters = {
    endDate: calculatedEndDate,
    judges: [judgeUser.name],
    startDate: calculatedStartDate,
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(judgeUser);

    applicationContext
      .getPersistenceGateway()
      .getCasesClosedByJudge.mockResolvedValue(mockReturnedCloseCases);
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
        judges: [judgeUser.name],
        startDate: 'yabbadabbadoo',
      }),
    ).rejects.toThrow();
  });

  it('should return the cases closed organized by status for selected judges', async () => {
    const result = await getCasesClosedByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().getCasesClosedByJudge.mock
        .calls[0][0],
    ).toMatchObject({
      endDate: calculatedEndDate,
      judges: [judgeUser.name],
      startDate: calculatedStartDate,
    });

    expect(result).toEqual(mockReturnedCloseCases);
  });
});
