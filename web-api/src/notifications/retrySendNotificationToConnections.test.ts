import { GoneException } from '@aws-sdk/client-apigatewaymanagementapi';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { retrySendNotificationToConnections } from './retrySendNotificationToConnections';

const mockConnections = [
  {
    clientConnectionId: 'aaaa',
    connectionId: '1111',
    endpoint: 'endpoint-01',
    pk: 'connections-01',
    sk: 'sk-01',
    userId: 'f911636b-2d69-4dd2-a01a-2622878d070c',
  },
  {
    clientConnectionId: 'bbbb',
    connectionId: '2222',
    endpoint: 'endpoint-02',
    pk: 'connections-02',
    sk: 'sk-02',
    userId: '324cd0c7-1d82-4916-a0fa-965255f7e087',
  },
  {
    clientConnectionId: 'cccc',
    connectionId: '3333',
    endpoint: 'endpoint-03',
    pk: 'connections-03',
    sk: 'sk-03',
    userId: '029c5833-9a79-4a3e-91ae-7eb9c7dd0f84',
  },
  {
    clientConnectionId: 'dddd',
    connectionId: '4444',
    endpoint: 'endpoint-04',
    pk: 'connections-04',
    sk: 'sk-04',
    userId: '1dca6ea7-66e8-473b-9790-c2cb1b822464',
  },
];

const mockMessageStringified = JSON.stringify('hello, computer');

const mockErrorMessage = 'ws connection is gone';
const notificationError = new GoneException({
  $metadata: { httpStatusCode: 410 },
  message: mockErrorMessage,
});

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
      .sendNotificationToConnection.mockRejectedValue(notificationError);

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
    notificationError['$metadata'].httpStatusCode = 400;
    await applicationContext
      .getNotificationGateway()
      .sendNotificationToConnection.mockRejectedValue(notificationError);

    await expect(
      retrySendNotificationToConnections({
        applicationContext,
        connections: mockConnections,
        messageStringified: mockMessageStringified,
      }),
    ).rejects.toThrow(mockErrorMessage);

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });
});
