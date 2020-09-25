const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { saveUserConnection } = require('./saveUserConnection');

describe('saveUserConnection', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';

    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: async () => Promise.resolve(null),
    });
  });

  it('attempts to persist the websocket connection details', async () => {
    await saveUserConnection({
      applicationContext,
      connectionId: 'abc',
      endpoint: {},
      userId: 'a66ac519-fd1a-44ac-8226-b4a53d348677',
    });

    expect(applicationContext.getDocumentClient().put).toHaveBeenCalledWith({
      Item: {
        connectionId: 'abc',
        endpoint: {},
        gsi1pk: 'connection|abc',
        pk: 'user|a66ac519-fd1a-44ac-8226-b4a53d348677',
        sk: 'connection|abc',
        ttl: expect.anything(),
      },
      TableName: 'efcms-dev',
      applicationContext: expect.anything(),
    });
  });
});
