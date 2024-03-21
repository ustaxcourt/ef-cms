import { UserNotificationMessage } from '@shared/notifications/UserNotificationMessage';
import { applicationContext } from '../business/test/createTestApplicationContext';
import { sendNotificationToUser } from './sendNotificationToUser';

describe('send websocket notification to browser', () => {
  const connections = [
    {
      endpoint: 'endpoint-01',
      pk: 'connections-01',
      sk: 'sk-01',
    },
    {
      endpoint: 'endpoint-02',
      pk: 'connections-02',
      sk: 'sk-02',
    },
    {
      endpoint: 'endpoint-03',
      pk: 'connections-03',
      sk: 'sk-03',
    },
    {
      endpoint: 'endpoint-04',
      pk: 'connections-04',
      sk: 'sk-04',
    },
  ];

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
    const mockMessage: UserNotificationMessage = {
      action: 'user_contact_initial_update_complete',
    };

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
});
