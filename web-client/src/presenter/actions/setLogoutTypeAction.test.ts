import { BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setLogoutTypeAction } from './setLogoutTypeAction';

describe('setLogoutTypeAction', () => {
  it('sets state.logoutType when called', async () => {
    const { state } = await runAction(
      setLogoutTypeAction(BROADCAST_MESSAGES.userLogout),
      {},
    );

    expect(state.logoutType).toEqual(BROADCAST_MESSAGES.userLogout);
  });
});
