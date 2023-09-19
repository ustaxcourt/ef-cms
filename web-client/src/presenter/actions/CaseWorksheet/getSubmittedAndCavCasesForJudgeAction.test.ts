import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getSubmittedAndCavCasesForJudgeAction } from '@web-client/presenter/actions/CaseWorksheet/getSubmittedAndCavCasesForJudgeAction';
import { judgeUser } from '@shared/test/mockUsers';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getSubmittedAndCavCasesForJudgeAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should retrieve cases with a status of submitted and cav for the provided judge from persistence and return items as props', async () => {
    const TEST_CASES = [];
    applicationContext
      .getUseCases()
      .getCasesByStatusAndByJudgeInteractor.mockResolvedValue({
        cases: TEST_CASES,
      });

    const {
      output: { cases },
    } = await runAction(getSubmittedAndCavCasesForJudgeAction, {
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
  });
});
