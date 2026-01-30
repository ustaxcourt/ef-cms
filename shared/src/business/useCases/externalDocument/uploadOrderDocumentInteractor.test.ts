import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { uploadOrderDocumentInteractor } from './uploadOrderDocumentInteractor';

describe('uploadOrderDocumentInteractor', () => {
  it('throws an error when an unauthorized user tries to access the use case', async () => {
    await expect(
      uploadOrderDocumentInteractor(
        applicationContext,
        {
          documentFile: '',
          fileIdToOverwrite: '123',
        },
        undefined,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('uploads documents on behalf of authorized users', async () => {
    await uploadOrderDocumentInteractor(
      applicationContext,
      {
        documentFile: 'document file',
        fileIdToOverwrite: '123',
      },
      mockDocketClerkUser,
    );

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
