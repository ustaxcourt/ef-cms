const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  createCourtIssuedOrderPdfFromHtmlInteractor,
} = require('./createCourtIssuedOrderPdfFromHtmlInteractor');

describe('createCourtIssuedOrderPdfFromHtmlInteractor', () => {
  it('should save the file to S3', async () => {
    const mockPdfUrl = 'www.example.com';
    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue(mockPdfUrl);

    await createCourtIssuedOrderPdfFromHtmlInteractor({
      applicationContext,
    });

    expect(
      applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl,
    ).toBeCalled();
  });

  it('returns the pdf url', async () => {
    const mockPdfUrl = 'www.example.com';
    applicationContext
      .getUseCaseHelpers()
      .saveFileAndGenerateUrl.mockReturnValue(mockPdfUrl);

    const result = await createCourtIssuedOrderPdfFromHtmlInteractor({
      applicationContext,
    });

    expect(result).toEqual(mockPdfUrl);
  });

  it('should catch, log, and rethrow an error thrown by chromium', async () => {
    applicationContext.getChromiumBrowser.mockImplementation(() => {
      throw new Error('some chromium error');
    });

    await expect(
      createCourtIssuedOrderPdfFromHtmlInteractor({
        applicationContext,
      }),
    ).rejects.toThrow('some chromium error');
  });
});
