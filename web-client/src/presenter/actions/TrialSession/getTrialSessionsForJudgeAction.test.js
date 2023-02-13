import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getTrialSessionsForJudgeAction } from './getTrialSessionsForJudgeAction';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getTrialSessionsForJudgeAction', () => {
  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
  });

  it('should invoke the interactor with the expected judge id when calling this action as a judge user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'judge',
      userId: '123',
    });
    applicationContext
      .getUseCases()
      .getTrialSessionsForJudgeInteractor.mockResolvedValue([
        {
          trialSessionId: 'abc',
        },
      ]);

    const result = await runAction(getTrialSessionsForJudgeAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {},
    });

    expect(
      applicationContext.getUseCases().getTrialSessionsForJudgeInteractor,
    ).toHaveBeenCalledWith(expect.anything(), '123');
    expect(result.output.trialSessions.length).toEqual(1);
  });

  it('should invoke the interactor with the expected judge id when calling this action as a chambers user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: 'chambers',
    });
    applicationContext
      .getUseCases()
      .getTrialSessionsForJudgeInteractor.mockResolvedValue([
        {
          trialSessionId: 'abc',
        },
      ]);

    const result = await runAction(getTrialSessionsForJudgeAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        judgeUser: {
          role: 'judge',
          userId: '123',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getTrialSessionsForJudgeInteractor,
    ).toHaveBeenCalledWith(expect.anything(), '123');
    expect(result.output.trialSessions.length).toEqual(1);
  });
});
