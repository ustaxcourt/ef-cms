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
  let applicationContext;
  const deleteStub = jest.fn().mockReturnValue({
    promise: async () => null,
  });
  const postToConnection = jest
    .fn()
    .mockReturnValue({ promise: () => Promise.resolve('ok') });
  const getWebSocketConnectionsByUserIdMock = jest.fn(() => connections);

  beforeEach(() => {
    jest.clearAllMocks();

    applicationContext = {
      environment: {
        stage: 'local',
      },
      getDocumentClient: () => ({
        delete: deleteStub,
      }),
      getNotificationClient: jest
        .fn()
        .mockImplementationOnce(() => {
          throw notificationError;
        })
        .mockImplementationOnce(() => {
          throw notificationError;
        })
        .mockImplementation(() => {
          return { postToConnection };
        }),
      getPersistenceGateway: () => ({
        getWebSocketConnectionsByUserId: getWebSocketConnectionsByUserIdMock,
      }),
    };
  });

  it('send notification to user', async () => {
    await sendNotificationToUser({
      applicationContext,
      message: 'hello, computer',
      userId: 'userId-000-000-0000',
    });
    expect(postToConnection.mock.calls.length).toBe(2);
    expect(deleteStub.mock.calls.length).toBe(2);
  });

  it('catches exception if statusCode is 410 and calls client.delete', async () => {
    let getNotificationClientStub = jest.fn().mockImplementation(() => {
      throw notificationError;
    });

    applicationContext = {
      ...applicationContext,
      getNotificationClient: getNotificationClientStub,
    };

    await sendNotificationToUser({
      applicationContext,
      message: 'hello, computer',
      userId: 'userId-000-000-0000',
    });

    expect(deleteStub).toBeCalled();
  });

  it('rethrows exception for statusCode not 410', async () => {
    notificationError.statusCode = 400;

    let getNotificationClientStub = jest.fn().mockImplementation(() => {
      throw notificationError;
    });

    applicationContext = {
      ...applicationContext,
      getNotificationClient: getNotificationClientStub,
    };

    await expect(
      sendNotificationToUser({
        applicationContext,
        message: 'hello, computer',
        userId: 'userId-000-000-0000',
      }),
    ).rejects.toThrow('could not get notification client');
  });
});
