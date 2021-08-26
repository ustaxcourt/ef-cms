const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  sendMaintenanceNotificationsInteractor,
} = require('./sendMaintenanceNotificationsInteractor');

describe('sendMaintenanceNotificationsInteractor', () => {
  let mockConnections;

  beforeEach(() => {
    mockConnections = [
      { connection: '1234' },
      { connection: '5678' },
      { connection: '9999' },
    ];

    applicationContext
      .getPersistenceGateway()
      .getAllWebSocketConnections.mockReturnValue(mockConnections);
  });

  it('should get all websocket connections', async () => {
    await sendMaintenanceNotificationsInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().getAllWebSocketConnections,
    ).toHaveBeenCalled();
  });

  it('should sendNotificationToConnection for each connection', async () => {
    await sendMaintenanceNotificationsInteractor(applicationContext);

    expect(
      applicationContext.getNotificationGateway().sendNotificationToConnection,
    ).toHaveBeenCalledTimes(mockConnections.length);
  });

  it('should log an error if sendNotificationToConnection fails and it is not a 410 error status', async () => {
    const notificationError = new Error('could not get notification client');
    notificationError.statusCode = 400;

    applicationContext.getNotificationClient.mockImplementation(() => ({
      notificationError,
    }));

    await expect(
      sendMaintenanceNotificationsInteractor(applicationContext),
    ).rejects.toThrow('');

    expect(applicationContext.logger.error.mock.calls[0][1]).toMatchObject({
      message: 'oopsies',
    });
  });
});
