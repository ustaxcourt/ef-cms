import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { judgeUser } from '@shared/test/mockUsers';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDefaultJudgeNameBasedOnUserAction } from './setDefaultJudgeNameBasedOnUserAction';

describe('setDefaultJudgeNameBasedOnUserAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should set state.judgeActivityReport.filters.judgeName to the last name of the current user', async () => {
    applicationContext.getCurrentUser.mockReturnValue(judgeUser);

    const { state } = await runAction(setDefaultJudgeNameBasedOnUserAction, {
      modules: {
        presenter,
      },
      state: {
        judgeUser,
      },
    });

    expect(state.judgeActivityReport.filters.judgeName).toBe(judgeUser.name);
  });
});
