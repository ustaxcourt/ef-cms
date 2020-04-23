const { applicationContext } = require('../test/createTestApplicationContext');
const { saveFileAndGenerateUrl } = require('./saveFileAndGenerateUrl');

describe('saveFileAndGenerateUrl', () => {
  it('saves the file to s3 and returns the url to the file', async () => {
    const mockPdfUrl = 'www.example.com';
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue(mockPdfUrl);

    const result = await saveFileAndGenerateUrl({
      applicationContext,
      file: '',
    });

    expect(applicationContext.getUniqueId).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().getDownloadPolicyUrl,
    ).toBeCalled();
    expect(result).toBe(mockPdfUrl);
  });
});
