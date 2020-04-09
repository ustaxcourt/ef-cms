const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getWebSocketConnectionsByUserId,
} = require('./getWebSocketConnectionsByUserId');

describe('getWebSocketConnectionsByUserId', () => {
  it('attempts to retrieve the connections for a user', async () => {
    const result = await getWebSocketConnectionsByUserId({
      applicationContext,
      userId: '123',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
