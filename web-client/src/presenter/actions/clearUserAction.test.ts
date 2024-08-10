import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { clearUserAction } from './clearUserAction';
import { emptyUserState } from '@web-client/presenter/state/userState';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearUserAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should unset state.token and state.permissions and reset state.user', async () => {
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

    expect(result.state.user).toEqual(emptyUserState);
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
});
