const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { getPdfFromUrlInteractor } = require('./getPdfFromUrlInteractor');

describe('getPdfFromUrlInteractor', () => {
  it('should return the pdf from persistence', async () => {
    const mockUrl = 'www.example.com';
    const mockFile = {
      name: 'mockfile.pdf',
    };
    applicationContext
      .getPersistenceGateway()
      .getPdfFromUrl.mockReturnValue(mockFile);

    const result = await getPdfFromUrlInteractor(applicationContext, {
      pdfUrl: mockUrl,
    });

    expect(
      applicationContext.getPersistenceGateway().getPdfFromUrl.mock.calls[0][0],
    ).toMatchObject({ url: mockUrl });
    expect(result.pdfFile).toBe(mockFile);
  });
});
