import { applicationContext } from '../test/createTestApplicationContext';
import { saveFileAndGenerateUrl } from './saveFileAndGenerateUrl';

describe('saveFileAndGenerateUrl', () => {
  it('should make a call to save the file to persistence and return the file ID and url to the file', async () => {
    const mockUUID = '3ce2be72-67a4-43bd-b665-0514830b1768';
    const mockPdfUrlAndId = { fileId: mockUUID, url: 'www.example.com' };
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue(mockPdfUrlAndId);
    applicationContext.getUniqueId.mockReturnValue(mockUUID);

    const result = await saveFileAndGenerateUrl({
      applicationContext,
      file: Buffer.from('abc', 'utf-8'),
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

  it('should include the provided file name prefix as part of the file`s key in persistence when a file name prefix is provided', async () => {
    const mockUUID = 'e6ec7312-2192-4541-bec8-4e4c5104f125';
    const mockPdfUrlAndId = { fileId: mockUUID, url: 'www.example.com' };
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue(mockPdfUrlAndId);
    applicationContext.getUniqueId.mockReturnValue(mockUUID);

    await saveFileAndGenerateUrl({
      applicationContext,
      file: Buffer.from('abc', 'utf-8'),
      fileNamePrefix: 'paper-service-pdf/',
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0].key,
    ).toEqual(`paper-service-pdf/${mockUUID}`);
  });
});
