import { applicationContext } from '../business/test/createTestApplicationContext';
import { retrySendNotificationToConnections } from './retrySendNotificationToConnections';

const mockConnections = [
  {
    connectionId: '1111',
    endpoint: 'endpoint-01',
    pk: 'connections-01',
    sk: 'sk-01',
  },
  {
    connectionId: '2222',
    endpoint: 'endpoint-02',
    pk: 'connections-02',
    sk: 'sk-02',
  },
  {
    connectionId: '3333',
    endpoint: 'endpoint-03',
    pk: 'connections-03',
    sk: 'sk-03',
  },
  {
    connectionId: '4444',
    endpoint: 'endpoint-04',
    pk: 'connections-04',
    sk: 'sk-04',
  },
] as TConnection[];

const mockMessageStringified = JSON.stringify('hello, computer');

const notificationError: NotificationError = new Error(
  'could not get notification client',
);
notificationError.statusCode = 410;

describe('retrySendNotificationToConnections', () => {
  it('should send notification to connections', async () => {
    await retrySendNotificationToConnections({
      applicationContext,
      connections: mockConnections,
      messageStringified: mockMessageStringified,
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToConnection
        .mock.calls.length,
    ).toBe(mockConnections.length);
  });

  it('catches exception if connection is no longer available and calls client.delete', async () => {
    await applicationContext
      .getNotificationGateway()
      .sendNotificationToConnection.mockRejectedValue(notificationError);

    await retrySendNotificationToConnections({
      applicationContext,
      connections: mockConnections,
      messageStringified: mockMessageStringified,
    });

    expect(
      applicationContext.getPersistenceGateway().deleteUserConnection,
    ).toHaveBeenCalledTimes(mockConnections.length);
  });

  it('does not call client.delete if deleteGoneConnections is false', async () => {
    await applicationContext
      .getNotificationGateway()
      .sendNotificationToConnection.mockRejectedValueOnce(notificationError);

    await retrySendNotificationToConnections({
      applicationContext,
      connections: mockConnections,
      deleteGoneConnections: false,
      messageStringified: mockMessageStringified,
    });

    expect(applicationContext.getDocumentClient().delete).toHaveBeenCalledTimes(
      0,
    );
  });

  it('rethrows and logs exception for statusCode not 410', async () => {
    notificationError.statusCode = 400;
    await applicationContext
      .getNotificationGateway()
      .sendNotificationToConnection.mockRejectedValue(notificationError);

    await expect(
      retrySendNotificationToConnections({
        applicationContext,
        connections: mockConnections,
        messageStringified: mockMessageStringified,
      }),
    ).rejects.toThrow('could not get notification client');

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });
});
