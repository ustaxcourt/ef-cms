import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { startDelayedLogoutAction } from './startDelayedLogoutAction';

presenter.providers.applicationContext = {
  getConstants: () => ({
    SESSION_DEBOUNCE: 250,
    SESSION_MODAL_TIMEOUT: 500,
  }),
};

describe('startDelayedLogoutAction', () => {
  it('creates a timer and stores it in state', async () => {
    const result = await runAction(startDelayedLogoutAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {},
    });
    expect(result.state.logoutTimer).not.toBeNull();
  });
});
