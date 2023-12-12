import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { put } from '../../dynamodbClientService';
import { saveUserConnection } from './saveUserConnection';
jest.mock('../../dynamodbClientService');
const putMock = put as jest.Mock;

describe('saveUserConnection', () => {
  beforeAll(() => {
    putMock.mockResolvedValue(null);
  });

  it('attempts to persist the websocket connection details', async () => {
    await saveUserConnection({
      applicationContext,
      clientConnectionId: 'bb',
      connectionId: 'abc',
      endpoint: 'test',
      userId: 'a66ac519-fd1a-44ac-8226-b4a53d348677',
    });

    expect(putMock.mock.calls[0][0]).toMatchObject({
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
