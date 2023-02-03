import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { clearUserAction } from './clearUserAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('clearUserAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should unset state.user, state.token, and state.permissions', async () => {
    const result = await runAction(clearUserAction, {
      modules: {
        presenter,
      },
      state: {
        permissions: {},
        token: 'abc123',
        user: {},
      },
    });

    expect(result.state.user).toBeUndefined();
    expect(result.state.token).toBeUndefined();
    expect(result.state.permissions).toBeUndefined();
  });

  it('should make two calls to remove the user token from persistence', async () => {
    await runAction(clearUserAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(
      applicationContext.getUseCases().removeItemInteractor,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getUseCases().removeItemInteractor.mock.calls[0][1]
        .key,
    ).toBe('user');
    expect(
      applicationContext.getUseCases().removeItemInteractor.mock.calls[1][1]
        .key,
    ).toBe('token');
  });

  it('should make a call to set currentUser to null', async () => {
    await runAction(clearUserAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(applicationContext.setCurrentUser).toHaveBeenCalled();
  });
});
