import { applicationContext } from '../../test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { uploadCorrespondenceDocumentInteractor } from './uploadCorrespondenceDocumentInteractor';

describe('uploadCorrespondenceDocumentInteractor', () => {
  const mockKey = 'cf105788-5d34-4451-aa8d-dfd9a851b675';
  const mockDocumentFile = 'bananas';

  it('should throw an Unauthorized error if the user role does not have the CASE_CORRESPONDENCE permission', async () => {
    await expect(
      uploadCorrespondenceDocumentInteractor(
        applicationContext,
        {} as any,
        mockPetitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should upload the document file to the specified correspondence document', async () => {
    await uploadCorrespondenceDocumentInteractor(
      applicationContext,
      {
        documentFile: mockDocumentFile,
        keyToOverwrite: mockKey,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().uploadDocumentFromClient.mock
        .calls[0][0],
    ).toMatchObject({
      applicationContext,
      document: mockDocumentFile,
      key: mockKey,
    });
  });
});
