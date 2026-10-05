import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { clearStateAndCodeVerifierAction } from '@web-client/presenter/actions/clearStateAndCodeVerifierAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearStateAndCodeVerifierAction', () => {
  beforeEach(() => {
    presenter.providers.applicationContext = applicationContext;
    localStorage.setItem('auth_state', '12345');
    localStorage.setItem('code_verifier', 'abcde');
  });

  it('should remove auth_state and code_verifier from local storage', async () => {
    await runAction(clearStateAndCodeVerifierAction, {
      modules: { presenter },
    });

    expect(localStorage.getItem('auth_state')).toBeNull();
    expect(localStorage.getItem('code_verifier')).toBeNull();
  });
});
