import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { saveUserConnection } from './saveUserConnection';

describe('saveUserConnection', () => {
  beforeAll(() => {
    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('attempts to persist the websocket connection details', async () => {
    await saveUserConnection({
      applicationContext,
      clientConnectionId: 'bb',
      connectionId: 'abc',
      endpoint: 'test',
      userId: 'a66ac519-fd1a-44ac-8226-b4a53d348677',
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        connectionId: 'abc',
        endpoint: {},
        gsi1pk: 'connection',
        pk: 'user|a66ac519-fd1a-44ac-8226-b4a53d348677',
        sk: 'connection|abc',
        ttl: expect.anything(),
      },
      applicationContext: expect.anything(),
    });
  });
});
