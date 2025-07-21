import { applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { sendNotificationToConnection } from './sendNotificationToConnection';

const mockConnection = {
  clientConnectionId: 'SOME_CLIENT_CONNECTION_ID',
  connectionId: '1',
  endpoint: 'endpoint-01',
  userId: 'SOME_USER_ID',
  ttl: Number.MAX_SAFE_INTEGER,
};

const mockMessage = 'hello, computer';

const send = jest.fn().mockResolvedValue('ok');

beforeEach(() => {
  applicationContext.getNotificationClient.mockImplementation(() => {
    return { send };
  });

  applicationContext
    .getPersistenceGateway()
    .getWebSocketConnectionsByUserId.mockResolvedValue(mockConnection);
});

it('should send notification to connection', async () => {
  await sendNotificationToConnection({
    applicationContext,
    connection: mockConnection,
    messageStringified: mockMessage,
  });

  expect(send.mock.calls[0][0].input).toMatchObject({
    ConnectionId: mockConnection.connectionId,
    Data: mockMessage,
  });
});
