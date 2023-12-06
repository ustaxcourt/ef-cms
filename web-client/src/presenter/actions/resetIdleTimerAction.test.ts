import { resetIdleTimerAction } from './resetIdleTimerAction';
import { runAction } from '@web-client/presenter/test.cerebral';
describe('resetIdleTimerAction', () => {
  it('resets the idle timer', async () => {
    const output = await runAction(resetIdleTimerAction, {
      state: {
        idleLogoutState: {
          logoutAt: 300,
          state: 'MONITORING',
        },
        lastIdleAction: 23423,
      },
    });
    expect(output.state).toMatchObject({
      idleLogoutState: {
        logoutAt: undefined,
        state: 'INITIAL',
      },
      lastIdleAction: expect.any(Number),
    });
  });
});
