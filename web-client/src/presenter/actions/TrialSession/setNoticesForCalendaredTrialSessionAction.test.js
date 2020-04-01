import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setNoticesForCalendaredTrialSessionAction } from './setNoticesForCalendaredTrialSessionAction';

describe('setNoticesForCalendaredTrialSessionAction', () => {
  let createObjectURLStub;

  beforeAll(() => {
    global.window = global;
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
