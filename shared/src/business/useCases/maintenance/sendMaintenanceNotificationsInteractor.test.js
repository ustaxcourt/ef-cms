const {
  applicationContext,
} = require('../../test/createTestApplicationContext');

describe('sendMaintenanceNotificationsInteractor', () => {
  let mockConnections;

  beforeEach(() => {
    mockConnections = applicationContext
      .getPersistenceGateway()
      .getAllWebSocketConnections.mockReturnValue([
        { connection: '1234' },
        { connection: '5678' },
        { connection: '9999' },
      ]);
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
