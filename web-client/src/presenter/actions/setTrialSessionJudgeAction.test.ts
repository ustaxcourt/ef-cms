import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionJudgeAction } from './setTrialSessionJudgeAction';

describe('setTrialSessionJudgeAction', () => {
  presenter.providers.applicationContext = applicationContext;

  beforeEach(() => {
    applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor.mockReturnValue({
        judge: {
          name: 'Judge Dredd',
        },
      });
  });

  it('sets the judge for the associated trial session on state', async () => {
    const result = await runAction(setTrialSessionJudgeAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          trialSessionId: 'trial-session-id-123',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getTrialSessionDetailsInteractor,
    ).toHaveBeenCalled();
    expect(result.state.trialSessionJudge).toEqual({
      name: 'Judge Dredd',
    });
  });

  it('sets the judge name as Unassigned if the trial session does not have a judge', async () => {
    applicationContext
      .getUseCases()
      .getTrialSessionDetailsInteractor.mockReturnValue({});

    const result = await runAction(setTrialSessionJudgeAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {
          trialSessionId: 'trial-session-id-123',
        },
      },
    });

    expect(
      applicationContext.getUseCases().getTrialSessionDetailsInteractor,
    ).toHaveBeenCalled();
    expect(result.state.trialSessionJudge).toEqual({
      name: 'Unassigned',
    });
  });

  it('does not call the interactor to fetch trial session details if the case does not have a trialSessionId', async () => {
    await runAction(setTrialSessionJudgeAction, {
      modules: {
        presenter,
      },
      props: {
        caseDetail: {},
      },
    });

    expect(
      applicationContext.getUseCases().getTrialSessionDetailsInteractor,
    ).not.toHaveBeenCalled();
  });
});
