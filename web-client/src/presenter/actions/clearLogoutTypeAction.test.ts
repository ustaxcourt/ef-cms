import { clearLogoutTypeAction } from './clearLogoutTypeAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearLogoutTypeAction', () => {
  it('should clear the logout type', async () => {
    const result = await runAction(clearLogoutTypeAction, {
      state: {
        logoutType: 'userLogout',
      },
    });

    expect(result.state.logoutType).toBe('');
  });
});
