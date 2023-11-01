import { CAV_AND_SUBMITTED_CASE_STATUS } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getSubmittedAndCavCasesForCurrentJudgeAction } from '@web-client/presenter/actions/CaseWorksheet/getSubmittedAndCavCasesForCurrentJudgeAction';
import { judgeUser } from '@shared/test/mockUsers';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getSubmittedAndCavCasesForCurrentJudgeAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should retrieve cases with a status of submitted and cav for the provided judge from persistence and return items as props', async () => {
    const TEST_CASES = [];
    applicationContext
      .getUseCases()
      .getCaseWorksheetsByJudgeInteractor.mockResolvedValue({
        cases: TEST_CASES,
      });

    const {
      output: { cases },
    } = await runAction(getSubmittedAndCavCasesForCurrentJudgeAction, {
      modules: {
        presenter,
      },
      state: {
        judgeUser,
      },
    });

    expect(
      applicationContext.getUseCases().getCaseWorksheetsByJudgeInteractor.mock
        .calls[0][1],
    ).toEqual({
      judges: [judgeUser.name],
      statuses: CAV_AND_SUBMITTED_CASE_STATUS,
    });
    expect(cases).toEqual(TEST_CASES);
  });
});
