import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setNoticesForCalendaredTrialSessionAction } from './setNoticesForCalendaredTrialSessionAction';

describe('setNoticesForCalendaredTrialSessionAction', () => {
  let setNoticesForCalendaredTrialSessionInteractorStub;

  beforeEach(() => {
    setNoticesForCalendaredTrialSessionInteractorStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        setNoticesForCalendaredTrialSessionInteractor: setNoticesForCalendaredTrialSessionInteractorStub,
      }),
    };
  });

  it('sets notices for the calendared trial session', async () => {
    await runAction(setNoticesForCalendaredTrialSessionAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {
          trialSessionId: 'abc-123',
        },
      },
    });

    expect(
      setNoticesForCalendaredTrialSessionInteractorStub,
    ).toHaveBeenCalled();
  });
});
