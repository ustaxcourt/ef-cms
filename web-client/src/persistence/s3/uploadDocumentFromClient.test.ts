import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { uploadDocumentFromClient } from './uploadDocumentFromClient';

describe('uploadDocument', () => {
  it('returns the expected key after the upload was successful', async () => {
    const KEY = 'abc';
    applicationContext.getUniqueId.mockReturnValue(KEY);
    applicationContext
      .getPersistenceGateway()
      .uploadPdfFromClient.mockReturnValue(KEY);

    const key = await uploadDocumentFromClient({
      applicationContext,
      document: 'test',
      key: KEY,
    });

    expect(key).toEqual(KEY);
  });
});
