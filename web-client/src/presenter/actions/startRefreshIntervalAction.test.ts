import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { startRefreshIntervalAction } from './startRefreshIntervalAction';

describe('startRefreshIntervalAction', () => {
  global.clearInterval = jest.fn();
  global.setInterval = jest.fn().mockImplementation(cb => {
    cb.apply();

    return 'new-interval';
  });

  presenter.providers.applicationContext = applicationContext;

  it('should start an interval timer to refresh the user`s auth tokens', async () => {
    applicationContext.getUseCases().renewIdTokenInteractor.mockResolvedValue({
      idToken: 'token-123',
    });

    const result = await runAction(startRefreshIntervalAction, {
      modules: {
        presenter,
      },
      state: {
        token: 'c89ac2f9-f2ec-4186-8d43-e5f952d62d56',
      },
    });

    expect(global.clearInterval).toHaveBeenCalled();
    expect(global.setInterval).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().renewIdTokenInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().setItemInteractor,
    ).not.toHaveBeenCalled();
    expect(result.state.refreshTokenInterval).toEqual('new-interval');
  });
});
