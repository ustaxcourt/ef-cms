import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getWebSocketConnectionsByUserId } from './getWebSocketConnectionsByUserId';

describe('getWebSocketConnectionsByUserId', () => {
  it('attempts to retrieve the connections for a user', async () => {
    const result = await getWebSocketConnectionsByUserId({
      applicationContext,
      userId: 'a66ac519-fd1a-44ac-8226-b4a53d348677',
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
