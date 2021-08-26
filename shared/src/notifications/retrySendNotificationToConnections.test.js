const {
  applicationContext,
} = require('../business/test/createTestApplicationContext');
const {
  retrySendNotificationToConnections,
} = require('./retrySendNotificationToConnections');

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
];

const mockMessageStringified = JSON.stringify('hello, computer');

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
  });

  it('should send notification to user', async () => {
    await retrySendNotificationToConnections({
      applicationContext,
      connections: mockConnections,
      messageStringified: mockMessageStringified,
    });

    console.log('postToConnection.mock.calls', postToConnection.mock.calls);

    expect(postToConnection.mock.calls.length).toBe(8);
    expect(
      applicationContext.getDocumentClient().delete.mock.calls.length,
    ).toBe(8);
  });

  it('catches exception if statusCode is 410 and calls client.delete', async () => {
    await retrySendNotificationToConnections({
      applicationContext,
      connections: mockConnections,
      messageStringified: mockMessageStringified,
    });

    expect(applicationContext.getDocumentClient().delete).toBeCalled();
  });

  it('rethrows and logs exception for statusCode not 410', async () => {
    notificationError.statusCode = 400;

    await expect(
      retrySendNotificationToConnections({
        applicationContext,
        connections: mockConnections,
        messageStringified: mockMessageStringified,
      }),
    ).rejects.toThrow('could not get notification client');

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });

  it('throws non 410 exception', async () => {
    let error;
    try {
      await retrySendNotificationToConnections({
        applicationContext,
        connections: mockConnections,
        messageStringified: mockMessageStringified,
      });
    } catch (err) {
      error = err;
    }

    expect(error).toBeDefined();
  });
});
