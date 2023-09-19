import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { startRefreshIntervalAction } from './startRefreshIntervalAction';

describe('startRefreshIntervalAction', () => {
  beforeAll(() => {
    global.clearInterval = jest.fn();
    global.setInterval = jest.fn().mockImplementation(cb => {
      cb.apply();

      return 'new-interval';
    });

    presenter.providers.applicationContext = applicationContext;
  });

  it('starts the refresh interval for auth tokens', async () => {
    applicationContext.getUseCases().refreshTokenInteractor.mockResolvedValue({
      token: 'token-123',
    });

    const result = await runAction(startRefreshIntervalAction, {
      modules: {
        presenter,
      },
    });

    expect(global.clearInterval).toHaveBeenCalled();
    expect(global.setInterval).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().refreshTokenInteractor,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCases().setItemInteractor,
    ).not.toHaveBeenCalled();
    expect(result.state.refreshTokenInterval).toEqual('new-interval');
  });
});
