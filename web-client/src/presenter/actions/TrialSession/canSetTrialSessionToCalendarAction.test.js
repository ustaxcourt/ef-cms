import { canSetTrialSessionToCalendarAction } from './canSetTrialSessionToCalendarAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

describe('canSetTrialSessionToCalendarAction', () => {
  let canSetTrialSessionAsCalendaredInteractorStub;
  let pathNoStub;
  let pathYesStub;

  beforeEach(() => {
    canSetTrialSessionAsCalendaredInteractorStub = jest.fn();
    pathNoStub = jest.fn();
    pathYesStub = jest.fn();

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        canSetTrialSessionAsCalendaredInteractor: canSetTrialSessionAsCalendaredInteractorStub,
      }),
    };

    presenter.providers.path = {
      no: pathNoStub,
      yes: pathYesStub,
    };
  });

  it('has invalid criteria to set trial session as calendared', async () => {
    canSetTrialSessionAsCalendaredInteractorStub.mockReturnValue(false);

    await runAction(canSetTrialSessionToCalendarAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {},
      },
    });

    expect(canSetTrialSessionAsCalendaredInteractorStub).toHaveBeenCalled();
    expect(pathNoStub).toHaveBeenCalled();
  });

  it('has valid criteria to set trial session as calendared', async () => {
    canSetTrialSessionAsCalendaredInteractorStub.mockReturnValue(true);

    await runAction(canSetTrialSessionToCalendarAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: {},
      },
    });

    expect(canSetTrialSessionAsCalendaredInteractorStub).toHaveBeenCalled();
    expect(pathYesStub).toHaveBeenCalled();
  });
});
