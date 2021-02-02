import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getShouldSetAppTimeoutModalAction } from './getShouldSetAppTimeoutModalAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('getShouldSetAppTimeoutModalAction', () => {
  const { ACTIVE, IDLE } = applicationContext.getConstants().IDLE_STATUS;

  let noMock;
  let yesMock;

  beforeAll(() => {
    noMock = jest.fn();
    yesMock = jest.fn();

    presenter.providers.path = {
      no: noMock,
      yes: yesMock,
    };

    presenter.providers.applicationContext = applicationContext;
  });

  it('should communicate with the broadcast gateway to get messages on the `idleStatus` topic', async () => {
    applicationContext.getBroadcastGateway().getMessages.mockResolvedValue([
      {
        idleStatus: IDLE,
      },
      {
        idleStatus: ACTIVE,
      },
    ]);

    await runAction(getShouldSetAppTimeoutModalAction, {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getBroadcastGateway().sendMessage,
    ).toHaveBeenCalledWith({ topic: 'idleStatus' });
    expect(
      applicationContext.getBroadcastGateway().getMessages,
    ).toHaveBeenCalled();
  });

  it('should return the yes path if all app instances have idleStatus of idle', async () => {
    applicationContext.getBroadcastGateway().getMessages.mockResolvedValue([
      {
        idleStatus: IDLE,
      },
      {
        idleStatus: IDLE,
      },
    ]);

    await runAction(getShouldSetAppTimeoutModalAction, {
      modules: {
        presenter,
      },
    });

    expect(noMock).not.toHaveBeenCalled();
    expect(yesMock).toHaveBeenCalled();
  });

  it('should return the no path any app instance does not have idleStatus of idle', async () => {
    applicationContext.getBroadcastGateway().getMessages.mockResolvedValue([
      {
        idleStatus: IDLE,
      },
      {
        idleStatus: ACTIVE,
      },
    ]);

    await runAction(getShouldSetAppTimeoutModalAction, {
      modules: {
        presenter,
      },
    });

    expect(noMock).toHaveBeenCalled();
    expect(yesMock).not.toHaveBeenCalled();
  });
});
