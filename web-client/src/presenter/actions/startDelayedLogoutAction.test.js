import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';
import { startDelayedLogoutAction } from './startDelayedLogoutAction';

describe('startDelayedLogoutAction', () => {
  beforeAll(() => {
    applicationContext.getConstants.mockReturnValue({
      SESSION_MODAL_TIMEOUT: 1,
    });
    presenter.providers.applicationContext = applicationContext;
  });

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
