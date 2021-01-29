import { runAction } from 'cerebral/test';
import { setShowIdleModalFactoryAction } from './setShowIdleModalFactoryAction';

describe('setShowIdleModalFactoryAction', () => {
  it('should set the idleStatus to idle for the current app instance', async () => {
    const { state } = await runAction(setShowIdleModalFactoryAction(true), {
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
        showAppTimeoutModal: true,
      },
    ]);
  });
  it('should set the idleStatus to idle for the current app instance', async () => {
    const { state } = await runAction(setShowIdleModalFactoryAction(false), {
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
        showAppTimeoutModal: false,
      },
    ]);
  });
});
