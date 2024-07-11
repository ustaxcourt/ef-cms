import { CASE_STATUS_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import {
  CasesClosedReturnType,
  getCasesClosedByJudgeInteractor,
} from './getCasesClosedByJudgeInteractor';
import { JudgeActivityStatisticsRequest } from '@web-api/business/useCases/judgeActivityReport/getCountOfCaseDocumentsFiledByJudgesInteractor';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  createEndOfDayISO,
  createStartOfDayISO,
} from '../../../../../shared/src/business/utilities/DateHandler';
import {
  judgeUser,
  petitionsClerkUser,
} from '../../../../../shared/src/test/mockUsers';

const mockClosedCases = 3;
const mockClosedDismissedCases = 2;

export const casesClosedResults: CasesClosedReturnType = {
  aggregations: {
    [CASE_STATUS_TYPES.closed]: mockClosedCases,
    [CASE_STATUS_TYPES.closedDismissed]: mockClosedDismissedCases,
  },
  total: 5,
};

describe('getCasesClosedByJudgeInteractor', () => {
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

  const mockValidRequest: JudgeActivityStatisticsRequest = {
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
      .getCasesClosedCountByJudge.mockResolvedValue(casesClosedResults);
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

  it('should return cases closed count organized by each closed status for selected judges', async () => {
    const closedCases = await getCasesClosedByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(
      applicationContext.getPersistenceGateway().getCasesClosedCountByJudge.mock
        .calls[0][0],
    ).toMatchObject({
      endDate: calculatedEndDate,
      judges: [judgeUser.name],
      startDate: calculatedStartDate,
    });

    expect(closedCases).toEqual(casesClosedResults);
  });
});
