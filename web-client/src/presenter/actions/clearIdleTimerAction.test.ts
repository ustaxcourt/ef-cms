import { clearIdleTimerAction } from './clearIdleTimerAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearLoginFormAction', () => {
  it('should reset the idle timer state', async () => {
    const result = await runAction(clearIdleTimerAction, {
      state: {
        idleLogoutState: {
          logoutAt: Date.now(),
          state: 'COUNTDOWN',
        },
        lastIdleAction: Date.now(),
      },
    });

    expect(result.state.lastIdleAction).not.toBeDefined();
    expect(result.state.idleLogoutState).toMatchObject({
      logoutAt: undefined,
      state: 'INITIAL',
    });
  });
});
