const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getPdfFromUrl } = require('./getPdfFromUrl');

describe('getPdfFromUrl', () => {
  it('should return the file from the provided url in persistence', async () => {
    const mockPdfUrl = 'www.example.com';
    const BLOB_DATA = 'abc';
    applicationContext.getHttpClient.mockImplementation(() => {
      const httpClient = () => ({
        data: BLOB_DATA,
      });
      httpClient.get = () => ({
        data: { url: mockPdfUrl },
      });

      return httpClient;
    });

    const result = await getPdfFromUrl({
      applicationContext,
    });

    expect(result).toEqual(new Blob([BLOB_DATA], { type: 'application/pdf' }));
  });
});
