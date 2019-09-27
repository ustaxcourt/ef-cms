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

const applicationContext = {
  getNotificationClient: jest
    .fn()
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

describe('update primary contact on a case', () => {
  let deleteStub;
  beforeEach(() => {
    deleteStub = sinon.stub(client, 'delete').resolves({});
  });

  afterEach(() => {
    client.delete.restore();
  });

  it('sends things', async () => {
    await sendNotificationToUser({
      applicationContext,
      message: 'hello, computer',
      userId: 'userId-000-000-0000',
    });
    expect(postToConnection.mock.calls.length).toBe(3);
    expect(deleteStub.callCount).toBe(1);
  });
});
