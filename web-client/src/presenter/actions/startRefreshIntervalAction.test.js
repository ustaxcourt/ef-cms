import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
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
  afterEach(() => {
    delete process.env.IS_LOCAL;
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

  it('should save the token to localStorage if running locally', async () => {
    process.env.IS_LOCAL = 'true';
    applicationContext.getUseCases().refreshTokenInteractor.mockResolvedValue({
      token: 'token-123',
    });
    await runAction(startRefreshIntervalAction, {
      modules: {
        presenter,
      },
    });
    expect(
      applicationContext.getUseCases().setItemInteractor,
    ).toHaveBeenCalled();
  });
});
