import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { startRefreshIntervalAction } from './startRefreshIntervalAction';

describe('startRefreshIntervalAction', () => {
  beforeEach(() => {
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
    ).toHaveBeenCalled();
    expect(result.state.refreshTokenInterval).toEqual('new-interval');
  });
});
