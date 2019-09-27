const {
  getWebSocketConnectionByConnectionId,
} = require('./getWebSocketConnectionByConnectionId');

describe('getWebSocketConnectionByConnectionId', () => {
  let applicationContext;
  let queryStub;

  it('attempts to retrieve the web socket details', async () => {
    queryStub = jest.fn(() => ({
      promise: async () => ({
        Items: [{ pk: 'connections-123', sk: 'abc' }],
      }),
    }));

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
    };

    const result = await getWebSocketConnectionByConnectionId({
      applicationContext,
      connectionId: 'abc',
    });
    expect(queryStub).toHaveBeenCalled();
    expect(result).toEqual({ pk: 'connections-123', sk: 'abc' });
  });

  it('returns undefined when no items are returned', async () => {
    queryStub = jest.fn(() => ({
      promise: async () => ({
        Items: [],
      }),
    }));

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        query: queryStub,
      }),
    };

    const result = await getWebSocketConnectionByConnectionId({
      applicationContext,
      connectionId: 'abc',
    });
    expect(queryStub).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
