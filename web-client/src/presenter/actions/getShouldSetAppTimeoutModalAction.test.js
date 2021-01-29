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

  it('should return the yes path if there is no active idle status in any app instance', async () => {
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

  it('should return the no path if there is an active idle status in any app instance', async () => {
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
