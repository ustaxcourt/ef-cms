import { runAction } from 'cerebral/test';
import { setIdleStatusIdleAction } from './setIdleStatusIdleAction';

describe('setIdleStatusIdleAction', () => {
  it('should set the idle status to idle for the current app instnace', async () => {
    const { state } = await runAction(setIdleStatusIdleAction, {
      state: {
        appInstanceId: 'foo',
        appInstances: [
          {
            appInstanceId: 'bar',
          },
          {
            appInstanceId: 'foo',
          },
        ],
      },
    });

    expect(state.appInstances).toEqual([
      {
        appInstanceId: 'bar',
      },
      {
        appInstanceId: 'foo',
        idleStatus: 'idle',
      },
    ]);
  });
});
