const {
  getWebSocketConnectionsByUserId,
} = require('./getWebSocketConnectionsByUserId');

describe('getWebSocketConnectionsByUserId', () => {
  let applicationContext;
  let queryStub;

  it('attempts to retrieve the connections for a user', async () => {
    queryStub = jest.fn(() => ({
      promise: async () => ({
        Items: [
          { pk: 'connections-123', sk: 'abc' },
          { pk: 'connections-123', sk: 'def' },
        ],
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

    const result = await getWebSocketConnectionsByUserId({
      applicationContext,
      userId: '123',
    });

    expect(queryStub).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
