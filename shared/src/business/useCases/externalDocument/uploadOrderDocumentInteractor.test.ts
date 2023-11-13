import { ROLES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { uploadOrderDocumentInteractor } from './uploadOrderDocumentInteractor';

describe('uploadOrderDocumentInteractor', () => {
  it('throws an error when an unauthorized user tries to access the use case', async () => {
    await expect(
      uploadOrderDocumentInteractor(applicationContext, {
        documentFile: '',
        fileIdToOverwrite: '123',
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('uploads documents on behalf of authorized users', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
      userId: 'admin',
    });

    await uploadOrderDocumentInteractor(applicationContext, {
      documentFile: 'document file',
      fileIdToOverwrite: '123',
    });

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls.length,
    ).toBe(1);
    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[0][0],
    ).toMatchObject({
      document: 'document file',
      key: '123',
    });
  });
});
