import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { setNoticesForCalendaredTrialSessionAction } from './setNoticesForCalendaredTrialSessionAction';

describe('setNoticesForCalendaredTrialSessionAction', () => {
  let setNoticesForCalendaredTrialSessionInteractorStub;
  let createObjectURLStub;

  beforeEach(() => {
    global.window = global;
    global.Blob = () => {};

    setNoticesForCalendaredTrialSessionInteractorStub = jest
      .fn()
      .mockReturnValue(null);
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
  });

  it('invokes the set notice interactor', async () => {
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
