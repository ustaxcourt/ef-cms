import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { sendReadOnlyNotificationsInteractor } from './sendReadOnlyNotificationsInteractor';

describe('sendReadOnlyNotificationsInteractor', () => {
  const mockConnections = [
    { connection: '1234' },
    { connection: '5678' },
    { connection: '9999' },
  ];

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getAllWebSocketConnections.mockReturnValue(mockConnections);
  });

  it('should get all websocket connections', async () => {
    await sendReadOnlyNotificationsInteractor(applicationContext, {
      readOnlyMode: true,
    });

    expect(
      applicationContext.getPersistenceGateway().getAllWebSocketConnections,
    ).toHaveBeenCalled();
  });

  it('should sendNotificationToConnection for each connection', async () => {
    const mockMessage = {
      action: 'read_only_mode_engaged',
    };
    await sendReadOnlyNotificationsInteractor(applicationContext, {
      readOnlyMode: true,
    });

    expect(
      applicationContext.getNotificationGateway()
        .retrySendNotificationToConnections.mock.calls[0][0].connections,
    ).toBe(mockConnections);
    expect(
      applicationContext.getNotificationGateway()
        .retrySendNotificationToConnections.mock.calls[0][0].messageStringified,
    ).toBe(JSON.stringify(mockMessage));
    expect(
      applicationContext.getNotificationGateway()
        .retrySendNotificationToConnections.mock.calls[0][0]
        .deleteGoneConnections,
    ).toBe(false);
  });

  it('should sendNotificationToConnection for each connection for readOnlyMode false', async () => {
    const mockMessage = {
      action: 'read_only_mode_disengaged',
    };
    await sendReadOnlyNotificationsInteractor(applicationContext, {
      readOnlyMode: false,
    });

    expect(
      applicationContext.getNotificationGateway()
        .retrySendNotificationToConnections.mock.calls[0][0].connections,
    ).toBe(mockConnections);
    expect(
      applicationContext.getNotificationGateway()
        .retrySendNotificationToConnections.mock.calls[0][0].messageStringified,
    ).toBe(JSON.stringify(mockMessage));
  });
});
