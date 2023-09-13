import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setNoticesForCalendaredTrialSessionAction } from './setNoticesForCalendaredTrialSessionAction';

describe('setNoticesForCalendaredTrialSessionAction', () => {
  let createObjectURLStub;

  beforeAll(() => {
    global.window ??= Object.create(global);
    global.Blob = () => {};

    createObjectURLStub = jest.fn().mockReturnValue('123456-abcdef');

    presenter.providers.applicationContext = applicationContext;
    presenter.providers.router = {
      createObjectURL: createObjectURLStub,
    };

    applicationContext
      .getUseCases()
      .setNoticesForCalendaredTrialSessionInteractor.mockReturnValue(null);
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
      applicationContext.getUseCases()
        .setNoticesForCalendaredTrialSessionInteractor,
    ).toHaveBeenCalled();
  });
});
