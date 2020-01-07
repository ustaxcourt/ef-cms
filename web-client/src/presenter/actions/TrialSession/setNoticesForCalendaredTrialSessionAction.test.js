import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setNoticesForCalendaredTrialSessionAction } from './setNoticesForCalendaredTrialSessionAction';

describe('setNoticesForCalendaredTrialSessionAction', () => {
  let setNoticesForCalendaredTrialSessionInteractorStub;
  let pathPaperStub;
  let pathElectronicStub;
  let createObjectURLStub;

  beforeEach(() => {
    setNoticesForCalendaredTrialSessionInteractorStub = jest
      .fn()
      .mockReturnValue(null);
    pathPaperStub = jest.fn();
    pathElectronicStub = jest.fn();
    createObjectURLStub = jest.fn();

    presenter.providers.router = {
      createObjectURL: () => {
        createObjectURLStub();
        return '123456-abcdef';
      },
    };

    presenter.providers.applicationContext = {
      getUseCases: () => ({
        setNoticesForCalendaredTrialSessionInteractor: setNoticesForCalendaredTrialSessionInteractorStub,
      }),
    };

    presenter.providers.path = {
      electronic: pathElectronicStub,
      paper: pathPaperStub,
    };
  });

  it('sets notices for the calendared trial session with all electronic cases', async () => {
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
    expect(pathElectronicStub).toHaveBeenCalled();
  });

  it('sets notices for the calendared trial session with at least one paper case', async () => {
    setNoticesForCalendaredTrialSessionInteractorStub.mockReturnValue([
      'pdf-bytes',
    ]);

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
    expect(pathPaperStub).toHaveBeenCalled();
  });
});
