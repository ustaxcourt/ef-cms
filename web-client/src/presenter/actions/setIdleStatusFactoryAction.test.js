import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { runAction } from 'cerebral/test';
import { setIdleStatusFactoryAction } from './setIdleStatusFactoryAction';

describe('setIdleStatusFactoryAction', () => {
  const { IDLE_STATUS } = applicationContext.getConstants();
  it('should set the idleStatus to idle for the current app instance', async () => {
    const { state } = await runAction(
      setIdleStatusFactoryAction(IDLE_STATUS.IDLE),
      {
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
      },
    );

    expect(state.appInstances).toEqual([
      {
        appInstanceId: 'bar',
      },
      {
        appInstanceId: 'foo',
        idleStatus: IDLE_STATUS.IDLE,
      },
    ]);
  });
  it('should set the idleStatus to active for the current app instance', async () => {
    const { state } = await runAction(
      setIdleStatusFactoryAction(IDLE_STATUS.ACTIVE),
      {
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
      },
    );

    expect(state.appInstances).toEqual([
      {
        appInstanceId: 'bar',
      },
      {
        appInstanceId: 'foo',
        idleStatus: IDLE_STATUS.ACTIVE,
      },
    ]);
  });
});
