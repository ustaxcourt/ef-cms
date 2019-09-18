import { cancelDelayedLogoutAction } from './cancelDelayedLogoutAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('cancelDelayedLogoutAction', () => {
  it('removes the logout timer from state', async () => {
    const result = await runAction(cancelDelayedLogoutAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        logoutTimer: {},
      },
    });
    expect(result.state.logoutTimer).toBeUndefined();
  });

  it('sets shouldIdleLogout to false', async () => {
    const result = await runAction(cancelDelayedLogoutAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        shouldIdleLogout: true,
      },
    });
    expect(result.state.shouldIdleLogout).toBeFalsy();
  });
});
