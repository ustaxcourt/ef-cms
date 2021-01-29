import { getShouldSetAppTimeoutModalAction } from './getShouldSetAppTimeoutModalAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getShouldSetAppTimeoutModalAction', () => {
  let noMock;
  let yesMock;

  beforeAll(() => {
    noMock = jest.fn();
    yesMock = jest.fn();

    presenter.providers.path = {
      no: noMock,
      yes: yesMock,
    };
  });

  it('should return the yes path if all app instances have idleStatus of idle', async () => {
    // TODO use applicationContext.getConstants().IDLE_STATUS constants here
    await runAction(getShouldSetAppTimeoutModalAction, {
      modules: {
        presenter,
      },
      state: {
        appInstanceId: 'foo',
        appInstances: [
          {
            appInstanceId: 'bar',
            idleStatus: 'idle',
          },
          {
            appInstanceId: 'foo',
            idleStatus: 'idle',
          },
        ],
      },
    });

    expect(yesMock).toHaveBeenCalled();
  });

  it('should return the no path any app instance does not have idleStatus of idle', async () => {
    await runAction(getShouldSetAppTimeoutModalAction, {
      modules: {
        presenter,
      },
      state: {
        appInstanceId: 'foo',
        appInstances: [
          {
            appInstanceId: 'bar',
            idleStatus: 'active',
          },
          {
            appInstanceId: 'foo',
            idleStatus: 'idle',
          },
        ],
      },
    });

    expect(noMock).toHaveBeenCalled();
  });
});
