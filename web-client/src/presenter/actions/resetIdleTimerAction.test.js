import { resetIdleTimerAction } from './resetIdleTimerAction';
import { runAction } from 'cerebral/test';
describe('resetIdleTimerAction', () => {
  it('resets the idle timer', async () => {
    const mock = jest.fn();
    const idleTimerRefMock = new Proxy(
      { reset: () => null },
      {
        get() {
          return mock;
        },
      },
    );
    await runAction(resetIdleTimerAction, {
      state: {
        idleTimerRef: idleTimerRefMock,
      },
    });
    expect(mock).toHaveBeenCalled();
  });
  it('exits quietly if no idle timer is present', async () => {
    await expect(
      runAction(resetIdleTimerAction, {
        state: {},
      }),
    ).resolves.toBeDefined();
  });
});
