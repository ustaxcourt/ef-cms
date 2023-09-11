import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setIdleStatusFactoryAction } from './setIdleStatusFactoryAction';

describe('setIdleStatusFactoryAction', () => {
  const { IDLE_STATUS } = applicationContext.getConstants();
  it('should set the idleStatus to idle for the current app instance', async () => {
    const { state } = await runAction(
      setIdleStatusFactoryAction(IDLE_STATUS.IDLE),
      {
        state: {},
      },
    );

    expect(state.idleStatus).toEqual(IDLE_STATUS.IDLE);
  });
});
