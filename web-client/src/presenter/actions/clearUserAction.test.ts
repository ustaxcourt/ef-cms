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
});
