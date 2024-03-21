import { applicationContext } from '../business/test/createTestApplicationContext';
import { sendNotificationToConnection } from './sendNotificationToConnection';

const mockConnection = {
  connectionId: '1',
  endpoint: 'endpoint-01',
  pk: 'connections-01',
  sk: 'sk-01',
} as TConnection;

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
    .getWebSocketConnectionsByUserId.mockReturnValue(mockConnection);
});

it('should send notification to connection', async () => {
  await sendNotificationToConnection({
    applicationContext,
    connection: mockConnection,
    messageStringified: mockMessage,
  });

  expect(postToConnection.mock.calls[0][0]).toMatchObject({
    ConnectionId: mockConnection.connectionId,
    Data: mockMessage,
  });
});
