import { IDLE_LOGOUT_STATES } from '@shared/business/entities/EntityConstants';
import { clearIdleTimerAction } from './clearIdleTimerAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearLoginFormAction', () => {
  it('should reset the idle timer state', async () => {
    const result = await runAction(clearIdleTimerAction, {
      state: {
        idleLogoutState: {
          logoutAt: Date.now(),
          state: IDLE_LOGOUT_STATES.COUNTDOWN,
        },
        lastIdleAction: Date.now(),
      },
    });

    expect(result.state.lastIdleAction).not.toBeDefined();
    expect(result.state.idleLogoutState).toMatchObject({
      logoutAt: undefined,
      state: IDLE_LOGOUT_STATES.INITIAL,
    });
  });
});
