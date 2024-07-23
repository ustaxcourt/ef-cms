import { LOGOUT_OPTIONS } from '@shared/business/entities/EntityConstants';
import { resetIdleTimerAction } from './resetIdleTimerAction';
import { runAction } from '@web-client/presenter/test.cerebral';
describe('resetIdleTimerAction', () => {
  it('resets the idle timer', async () => {
    const output = await runAction(resetIdleTimerAction, {
      state: {
        idleLogoutState: {
          logoutAt: 300,
          state: LOGOUT_OPTIONS.idleLogoutStates.MONITORING,
        },
        lastIdleAction: 23423,
      },
    });
    expect(output.state).toMatchObject({
      idleLogoutState: {
        logoutAt: undefined,
        state: LOGOUT_OPTIONS.idleLogoutStates.INITIAL,
      },
      lastIdleAction: expect.any(Number),
    });
  });
});
