import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { logOldLoginAttemptAction } from '@web-client/presenter/actions/Login/logOldLoginAttemptAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('logOldLoginAttemptAction', () => {
  beforeAll(() => {
    applicationContext
      .getUseCases()
      .logOldLoginAttemptInteractor.mockImplementation(() => {});

    presenter.providers.applicationContext = applicationContext;
  });

  it('should call logOldLoginAttemptInteractor', async () => {
    await runAction(logOldLoginAttemptAction, {
      modules: {
        presenter,
      },
    });

    const logOldLoginAttemptInteractorCalls =
      applicationContext.getUseCases().logOldLoginAttemptInteractor.mock.calls;
    expect(logOldLoginAttemptInteractorCalls.length).toEqual(1);
  });
});
