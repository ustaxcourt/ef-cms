import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { sendMaintenanceNotificationsInteractor } from './sendMaintenanceNotificationsInteractor';

describe('sendMaintenanceNotificationsInteractor', () => {
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
    await sendMaintenanceNotificationsInteractor(applicationContext, {
      maintenanceMode: true,
    });

    expect(
      applicationContext.getPersistenceGateway().getAllWebSocketConnections,
    ).toHaveBeenCalled();
  });

  it('should sendNotificationToConnection for each connection', async () => {
    const mockMessage = {
      action: 'maintenance_mode_engaged',
    };
    await sendMaintenanceNotificationsInteractor(applicationContext, {
      maintenanceMode: true,
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

  it('should sendNotificationToConnection for each connection for maintenanceMode false', async () => {
    const mockMessage = {
      action: 'maintenance_mode_disengaged',
    };
    await sendMaintenanceNotificationsInteractor(applicationContext, {
      maintenanceMode: false,
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
