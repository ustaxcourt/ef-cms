import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { GetCasesByStatusAndByJudgeRequest } from '@shared/business/useCases/judgeActivityReport/getCaseWorksheetsByJudgeInteractor';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getSubmittedAndCavCasesByJudgeAction } from './getSubmittedAndCavCasesByJudgeAction';
import { judgeUser } from '@shared/test/mockUsers';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getSubmittedAndCavCasesByJudgeAction', () => {
  presenter.providers.applicationContext = applicationContext;
  const mockEndDate = '2022-04-13';
  const mockStartDate = '12/12/1923';
  const mockTotalCountOfSubmittedAndCavCases = 15;
  const pageNumber = 0;

  const judgeActivityReportStateFilters = {
    endDate: mockEndDate,
    judgeName: judgeUser.name,
    judges: [judgeUser.name],
    startDate: mockStartDate,
  };

  const getCasesByStatusAndByJudgeRequestParams: GetCasesByStatusAndByJudgeRequest =
    {
      judges: [judgeUser.name],
      statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
    };

  let mockReturnedCases;
  let mockCustomCaseReportResponse;

  beforeEach(() => {
    mockReturnedCases = [
      {
        docketNumber: '101-22',
        leadDocketNumber: '101-22',
        status: 'Submitted',
      },
      { docketNumber: '111-11', status: 'Submitted' },
      { docketNumber: '134-21', status: 'CAV' },
    ];

    mockCustomCaseReportResponse = {
      cases: mockReturnedCases,
      totalCount: mockTotalCountOfSubmittedAndCavCases,
    };

    applicationContext
      .getUseCases()
      .getCaseWorksheetsByJudgeInteractor.mockReturnValueOnce(
        mockCustomCaseReportResponse,
      );
  });

  it('should retrieve cases with a status of submitted and cav for the provided judge from persistence and return items as props', async () => {
    const result = await runAction(getSubmittedAndCavCasesByJudgeAction, {
      modules: {
        presenter,
      },
      props: {
        selectedPage: pageNumber,
      },
      state: {
        judgeActivityReport: {
          filters: judgeActivityReportStateFilters,
        },
      },
    });

    expect(
      (
        applicationContext.getUseCases()
          .getCaseWorksheetsByJudgeInteractor as jest.Mock
      ).mock.calls[0][1],
    ).toMatchObject(getCasesByStatusAndByJudgeRequestParams);
    expect(result.output.cases).toBe(mockReturnedCases);
  });
});
