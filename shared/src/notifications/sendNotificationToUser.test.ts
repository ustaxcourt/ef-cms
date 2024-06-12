import { applicationContext } from '../business/test/createTestApplicationContext';
import { sendNotificationToUser } from './sendNotificationToUser';

describe('sendNotificationToUser', () => {
  const connections = [
    {
      clientConnectionId: '0',
      endpoint: 'endpoint-01',
      pk: 'connections-01',
      sk: 'sk-01',
    },
    {
      clientConnectionId: '1',
      endpoint: 'endpoint-02',
      pk: 'connections-02',
      sk: 'sk-02',
    },
    {
      clientConnectionId: '2',
      endpoint: 'endpoint-03',
      pk: 'connections-03',
      sk: 'sk-03',
    },
    {
      clientConnectionId: '3',
      endpoint: 'endpoint-04',
      pk: 'connections-04',
      sk: 'sk-04',
    },
  ];
  const mockMessage = 'hello, computer';

  const postToConnection = jest
    .fn()
    .mockReturnValue({ promise: () => Promise.resolve('ok') });

  beforeEach(() => {
    applicationContext.getNotificationClient.mockImplementation(() => {
      return { postToConnection };
    });

    applicationContext
      .getPersistenceGateway()
      .getWebSocketConnectionsByUserId.mockReturnValue(connections);
  });

  it('should send notification to user', async () => {
    await sendNotificationToUser({
      applicationContext,
      message: mockMessage,
      userId: 'userId-000-000-0000',
    });

    expect(
      applicationContext.getNotificationGateway()
        .retrySendNotificationToConnections.mock.calls[0][0].connections,
    ).toBe(connections);
    expect(
      applicationContext.getNotificationGateway()
        .retrySendNotificationToConnections.mock.calls[0][0].messageStringified,
    ).toBe(JSON.stringify(mockMessage));
  });

  it('should filter for the correct clientConnectionId when it is passed in', async () => {
    await sendNotificationToUser({
      applicationContext,
      clientConnectionId: '1',
      message: mockMessage,
      userId: 'userId-000-000-0000',
    });

    expect(
      applicationContext.getNotificationGateway()
        .retrySendNotificationToConnections.mock.calls[0][0].connections,
    ).toEqual([connections[1]]);
  });
});
