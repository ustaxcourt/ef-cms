import { judgeUser } from '@shared/test/mockUsers';
import { runAction } from '@web-client/presenter/test.cerebral';
import { trialSessionQueryParamsAction } from '@web-client/presenter/actions/TrialSession/trialSessionQueryParamsAction';

describe('trialSessionQueryParamsAction', () => {
  it('should transform judgeId into a judge filter', async () => {
    const judgeId = judgeUser.userId;

    const result = await runAction(trialSessionQueryParamsAction, {
      props: {
        judgeId,
      },
      state: {
        legacyAndCurrentJudges: [judgeUser],
        trialSessionsPage: { trialSessions: [] },
      },
    });
    expect(result.state.trialSessionsPage.filters.judges).toEqual({
      [judgeId]: { name: judgeUser.name, userId: judgeUser.userId },
    });
  });
});
