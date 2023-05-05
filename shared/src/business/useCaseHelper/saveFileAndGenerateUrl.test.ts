import { applicationContext } from '../test/createTestApplicationContext';
import { saveFileAndGenerateUrl } from './saveFileAndGenerateUrl';

describe('saveFileAndGenerateUrl', () => {
  it('saves the file to s3 and return the file ID and url to the file', async () => {
    const mockUUID = '12345';
    const mockPdfUrlAndId = { fileId: mockUUID, url: 'www.example.com' };
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue(mockPdfUrlAndId);
    applicationContext.getUniqueId.mockReturnValue(mockUUID);

    const result = await saveFileAndGenerateUrl({
      applicationContext,
      file: '',
    });

    expect(applicationContext.getUniqueId).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({ useTempBucket: false });
    expect(
      applicationContext.getPersistenceGateway().getDownloadPolicyUrl,
    ).toHaveBeenCalled();
    expect(result).toEqual(mockPdfUrlAndId);
  });
});
