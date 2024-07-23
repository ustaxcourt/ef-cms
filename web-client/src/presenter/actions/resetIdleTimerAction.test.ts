import { IDLE_LOGOUT_STATES } from '@shared/business/entities/EntityConstants';
import { resetIdleTimerAction } from './resetIdleTimerAction';
import { runAction } from '@web-client/presenter/test.cerebral';
describe('resetIdleTimerAction', () => {
  it('resets the idle timer', async () => {
    const output = await runAction(resetIdleTimerAction, {
      state: {
        idleLogoutState: {
          logoutAt: 300,
          state: IDLE_LOGOUT_STATES.MONITORING,
        },
        lastIdleAction: 23423,
      },
    });
    expect(output.state).toMatchObject({
      idleLogoutState: {
        logoutAt: undefined,
        state: IDLE_LOGOUT_STATES.INITIAL,
      },
      lastIdleAction: expect.any(Number),
    });
  });
});
