import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@shared/business/test/createTestApplicationContext';
import { getSubmittedAndCavCasesByJudgeForDashboardAction } from '@web-client/presenter/actions/JudgeActivityReport/getSubmittedAndCavCasesByJudgeForDashboardAction';
import { judgeUser } from '@shared/test/mockUsers';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getSubmittedAndCavCasesByJudgeForDashboardAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should retrieve cases with a status of submitted and cav for the provided judge from persistence and return items as props', async () => {
    const TEST_CASES = [];
    const TEST_CONSOLIDATED_CASES_GROUP_COUNT_MAP = 'IDK_TYPE_OF_THIS';
    const TEST_TOTAL_COUNT = 12345;
    applicationContext
      .getUseCases()
      .getCasesByStatusAndByJudgeInteractor.mockResolvedValue({
        cases: TEST_CASES,
        consolidatedCasesGroupCountMap: TEST_CONSOLIDATED_CASES_GROUP_COUNT_MAP,
        totalCount: TEST_TOTAL_COUNT,
      });

    const {
      output: {
        cases,
        consolidatedCasesGroupCountMap,
        totalCountForSubmittedAndCavCases,
      },
    } = await runAction(getSubmittedAndCavCasesByJudgeForDashboardAction, {
      modules: {
        presenter,
      },
      state: {
        judgeUser,
      },
    });

    expect(
      applicationContext.getUseCases().getCasesByStatusAndByJudgeInteractor.mock
        .calls[0][1],
    ).toEqual({
      judges: [judgeUser.name],
      pageNumber: 0,
      pageSize: 10000,
      statuses: [CASE_STATUS_TYPES.submitted, CASE_STATUS_TYPES.cav],
    });
    expect(cases).toEqual(TEST_CASES);
    expect(consolidatedCasesGroupCountMap).toEqual(
      TEST_CONSOLIDATED_CASES_GROUP_COUNT_MAP,
    );
    expect(totalCountForSubmittedAndCavCases).toEqual(TEST_TOTAL_COUNT);
  });
});
