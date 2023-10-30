import { applicationContext } from '../test/createTestApplicationContext';
import { getPaperServicePdfUrlInteractor } from './getPaperServicePdfUrlInteractor';
import { petitionerUser, petitionsClerkUser } from '@shared/test/mockUsers';

describe('getPaperServicePdfUrlInteractor', () => {
  it('should throw an unauthorized error when the user does not have permission to re-print trial session paper service documents', async () => {
    applicationContext.getCurrentUser.mockReturnValueOnce(petitionerUser); // Only trial clerks and petitions clerks can re-print paper service documents

    await expect(
      getPaperServicePdfUrlInteractor(applicationContext, {
        fileId: 'd30ca1a5-6e9c-411d-a292-3e89abf13141',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should return a url to the document specified when the user has permission to re-print trial session paper service documents', async () => {
    const mockFileId = 'd30ca1a5-6e9c-411d-a292-3e89abf13141';
    const mockDocumentUrl = 'example.com';
    applicationContext.getCurrentUser.mockReturnValueOnce(petitionsClerkUser);
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockResolvedValue({ url: mockDocumentUrl });

    const { url } = await getPaperServicePdfUrlInteractor(applicationContext, {
      fileId: mockFileId,
    });

    expect(
      applicationContext.getPersistenceGateway().getDownloadPolicyUrl,
    ).toHaveBeenCalledWith({
      applicationContext: expect.anything(),
      key: `paper-service-pdf/${mockFileId}`,
    });
    expect(url).toEqual(mockDocumentUrl);
  });
});
