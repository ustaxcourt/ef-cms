import { BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';
import { clearLogoutTypeAction } from './clearLogoutTypeAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearLogoutTypeAction', () => {
  it('should clear the logout type', async () => {
    const result = await runAction(clearLogoutTypeAction, {
      state: {
        logoutType: BROADCAST_MESSAGES.userLogout,
      },
    });

    expect(result.state.logoutType).toBe('');
  });
});
