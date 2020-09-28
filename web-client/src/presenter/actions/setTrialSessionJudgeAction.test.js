import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { setTrialSessionJudgeAction } from './setTrialSessionJudgeAction';

describe('setTrialSessionJudgeAction', () => {
  const mockGetTrialSessionDetails = jest.fn().mockReturnValue({
    judge: {
      name: 'Judge Dredd',
    },
  });

  beforeAll(() => {
    presenter.providers.applicationContext = {
      getUseCases: () => ({
        getTrialSessionDetailsInteractor: mockGetTrialSessionDetails,
      }),
    };
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

    expect(mockGetTrialSessionDetails).toHaveBeenCalled();

    expect(result.state.trialSessionJudge).toEqual({
      name: 'Judge Dredd',
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

    expect(mockGetTrialSessionDetails).not.toHaveBeenCalled();
  });
});
