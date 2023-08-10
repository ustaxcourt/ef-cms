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
  const mockClosedCases = 3;
  const mockClosedDismissedCases = 2;

  const mockReturnedCloseCases: CasesClosedType = {
    [CASE_STATUS_TYPES.closed]: mockClosedCases,
    [CASE_STATUS_TYPES.closedDismissed]: mockClosedDismissedCases,
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

  const aggregationsResults = {
    closed_cases: {
      buckets: [
        { doc_count: mockClosedCases, key: CASE_STATUS_TYPES.closed },
        {
          doc_count: mockClosedDismissedCases,
          key: CASE_STATUS_TYPES.closedDismissed,
        },
      ],
    },
  };

  let casesClosedResults: any = {};

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(judgeUser);

    applicationContext
      .getPersistenceGateway()
      .getCasesClosedByJudge.mockResolvedValue(casesClosedResults);

    casesClosedResults = {
      aggregations: aggregationsResults,
      total: 3,
    };
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

  it('should return cases closed count organized by status closed for selected judges', async () => {
    const closedCases = await getCasesClosedByJudgeInteractor(
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

    expect(closedCases.results).toEqual(mockReturnedCloseCases);
  });

  it('should return a zero count(s) for both closed and closed - dismissed for judges if there no closed cases associated with selected judges', async () => {
    casesClosedResults.aggregations.closed_cases.buckets = [];
    applicationContext
      .getPersistenceGateway()
      .getCasesClosedByJudge.mockResolvedValue(casesClosedResults);

    const mockReturnedCloseCasesWithZeroItems = {
      [CASE_STATUS_TYPES.closed]: 0,
      [CASE_STATUS_TYPES.closedDismissed]: 0,
    };

    const closedCasesResults = await getCasesClosedByJudgeInteractor(
      applicationContext,
      mockValidRequest,
    );

    expect(closedCasesResults.results).toEqual(
      mockReturnedCloseCasesWithZeroItems,
    );
  });
});
