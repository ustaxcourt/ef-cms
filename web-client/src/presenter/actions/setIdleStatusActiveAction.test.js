import { runAction } from 'cerebral/test';
import { setIdleStatusActiveAction } from './setIdleStatusActiveAction';

describe('setIdleStatusActiveAction', () => {
  it('should set the ide status to active for the current app instance', async () => {
    const { state } = await runAction(setIdleStatusActiveAction, {
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
        idleStatus: 'active',
      },
    ]);
  });
});
