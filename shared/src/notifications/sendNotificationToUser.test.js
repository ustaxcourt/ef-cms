const {
  applicationContext,
} = require('../business/test/createTestApplicationContext');
const { sendNotificationToUser } = require('./sendNotificationToUser');

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

const notificationError = new Error('could not get notification client');
notificationError.statusCode = 410;

describe('send websocket notification to browser', () => {
  const postToConnection = jest
    .fn()
    .mockReturnValue({ promise: () => Promise.resolve('ok') });

  beforeEach(() => {
    applicationContext.getNotificationClient
      .mockImplementationOnce(() => {
        throw notificationError;
      })
      .mockImplementationOnce(() => {
        throw notificationError;
      })
      .mockImplementationOnce(() => {
        throw notificationError;
      })
      .mockImplementationOnce(() => {
        throw notificationError;
      })
      .mockImplementation(() => {
        return { postToConnection };
      });

    applicationContext
      .getPersistenceGateway()
      .getWebSocketConnectionsByUserId.mockReturnValue(connections);
  });

  it('should send notification to user', async () => {
    await sendNotificationToUser({
      applicationContext,
      message: 'hello, computer',
      userId: 'userId-000-000-0000',
    });

    expect(postToConnection.mock.calls.length).toBe(2);
    expect(
      applicationContext.getDocumentClient().delete.mock.calls.length,
    ).toBe(2);
  });

  it('catches exception if statusCode is 410 and calls client.delete', async () => {
    await sendNotificationToUser({
      applicationContext,
      message: 'hello, computer',
      userId: 'userId-000-000-0000',
    });

    expect(applicationContext.getDocumentClient().delete).toBeCalled();
  });

  it('rethrows and logs exception for statusCode not 410', async () => {
    notificationError.statusCode = 400;

    await expect(
      sendNotificationToUser({
        applicationContext,
        message: 'hello, computer',
        userId: 'userId-000-000-0000',
      }),
    ).rejects.toThrow('could not get notification client');

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });

  it('throws non 410 exception', async () => {
    let error;
    try {
      await sendNotificationToUser({
        applicationContext,
        message: 'hello, computer',
        userId: 'userId-000-000-0000',
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
  });
});
