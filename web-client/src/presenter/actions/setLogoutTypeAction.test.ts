import { runAction } from '@web-client/presenter/test.cerebral';
import { setLogoutTypeAction } from './setLogoutTypeAction';

describe('setLogoutTypeAction', () => {
  it('sets state.logoutType when called', async () => {
    const { state } = await runAction(setLogoutTypeAction('userLogout'), {});

    expect(state.logoutType).toEqual('userLogout');
  });
});
