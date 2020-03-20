const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getWebSocketConnectionByConnectionId,
} = require('./getWebSocketConnectionByConnectionId');

const mockConnection = { pk: 'connections-123', sk: 'abc' };

describe('getWebSocketConnectionByConnectionId', () => {
  it('attempts to retrieve the web socket details', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: async () => ({
        Items: [mockConnection],
      }),
    });

    const result = await getWebSocketConnectionByConnectionId({
      applicationContext,
      connectionId: 'abc',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(result).toEqual(mockConnection);
  });

  it('returns undefined when no items are returned', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: async () => ({
        Items: [],
      }),
    });

    const result = await getWebSocketConnectionByConnectionId({
      applicationContext,
      connectionId: 'abc',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
