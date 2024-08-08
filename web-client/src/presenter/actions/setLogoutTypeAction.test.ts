import { LOGOUT_BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setLogoutTypeAction } from './setLogoutTypeAction';

describe('setLogoutTypeAction', () => {
  it('sets state.logoutType when called', async () => {
    const { state } = await runAction(
      setLogoutTypeAction(LOGOUT_BROADCAST_MESSAGES.userLogout),
      {},
    );

    expect(state.logoutType).toEqual(LOGOUT_BROADCAST_MESSAGES.userLogout);
  });
});
