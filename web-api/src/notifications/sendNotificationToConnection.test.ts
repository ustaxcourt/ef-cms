import { applicationContext } from '../../../shared/src/business/test/createTestApplicationContext';
import { sendNotificationToConnection } from './sendNotificationToConnection';

const mockConnection = {
  connectionId: '1',
  endpoint: 'endpoint-01',
  pk: 'connections-01',
  sk: 'sk-01',
};

const mockMessage = 'hello, computer';

const send = jest.fn().mockResolvedValue('ok');

beforeEach(() => {
  applicationContext.getNotificationClient.mockImplementation(() => {
    return { send };
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

  expect(send.mock.calls[0][0].input).toMatchObject({
    ConnectionId: mockConnection.connectionId,
    Data: mockMessage,
  });
});
