const {
  applicationContext,
} = require('../../test/createTestApplicationContext');

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

  it.only('should get all websocket connections', async () => {
    await applicationContext
      .getUseCases()
      .sendMaintenanceNotificationsInteractor(applicationContext);

    expect(
      applicationContext.getPersistenceGateway().getAllWebSocketConnections,
    ).toHaveBeenCalled();
  });

  it('should call sendNotificationToConnection for each connection', async () => {
    await applicationContext
      .getUseCases()
      .sendMaintenanceNotificationsInteractor(applicationContext);

    expect(
      applicationContext.getNotificationGateway().sendNotificationToConnection,
    ).toHaveBeenCalledTimes(mockConnections.length);
  });
});
