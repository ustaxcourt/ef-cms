import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { colvinsChambersUser, judgeUser } from '@shared/test/mockUsers';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setJudgeLastNameOnJudgeActivityReportAction } from './setJudgeLastNameOnJudgeActivityReportAction';

describe('setJudgeLastNameOnJudgeActivityReportAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set state.judgeActivityReport.filters.judgeName (and judgeNameToDisplayForHeader) to the last name of the current user when they are a judge', async () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    const { state } = await runAction(
      setJudgeLastNameOnJudgeActivityReportAction,
      {
        modules: {
          presenter,
        },
      },
    );

    expect(state.judgeActivityReport.judgeName).toBe(judgeUser.name);
    expect(state.judgeActivityReport.judgeNameToDisplayForHeader).toBe(
      judgeUser.name,
    );
  });

  it('should set state.judgeActivityReport.filters.judgeName (and judgeNameToDisplayForHeader) to the last name of the judge of the chambers when the current user is a chambers user', async () => {
    applicationContext.getCurrentUser.mockReturnValue(colvinsChambersUser);

    const { state } = await runAction(
      setJudgeLastNameOnJudgeActivityReportAction,
      {
        modules: {
          presenter,
        },
      },
    );

    expect(state.judgeActivityReport.judgeNameToDisplayForHeader).toBe(
      'Colvin',
    );
    expect(state.judgeActivityReport.judgeName).toBe('Colvin');
  });
});
