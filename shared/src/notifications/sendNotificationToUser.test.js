const client = require('../persistence/dynamodbClientService');
const sinon = require('sinon');
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

const postToConnection = jest
  .fn()
  .mockReturnValue({ promise: () => Promise.resolve('ok') });

const getWebSocketConnectionsByUserIdMock = jest.fn(() => connections);

let applicationContext = {
  getNotificationClient: jest
    .fn()
    .mockImplementationOnce(() => {
      throw notificationError;
    })
    .mockImplementationOnce(() => {
      throw new Error('some other error');
    })
    .mockImplementation(() => {
      return { postToConnection };
    }),
  getPersistenceGateway: () => ({
    getWebSocketConnectionsByUserId: getWebSocketConnectionsByUserIdMock,
  }),
};

describe('send websocket notification to browser', () => {
  let deleteStub;
  beforeEach(() => {
    deleteStub = sinon.stub(client, 'delete').resolves({});
  });

  afterEach(() => {
    client.delete.restore();
  });

  it('send notification to user', async () => {
    await sendNotificationToUser({
      applicationContext,
      message: 'hello, computer',
      userId: 'userId-000-000-0000',
    });
    expect(postToConnection.mock.calls.length).toBe(2);
    expect(deleteStub.callCount).toBe(1);
  });

  it('throws exception', async () => {
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

    expect(getNotificationClientStub).toThrow();
  });
});
