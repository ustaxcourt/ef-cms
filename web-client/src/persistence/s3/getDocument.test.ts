import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getDocument } from './getDocument';
import { getPdfFromUrl } from '@web-client/persistence/s3/getPdfFromUrl';

const BLOB_DATA = 'abc';
jest.mock('./getPdfFromUrl', () => ({
  getPdfFromUrl: jest.fn().mockReturnValue({
    name: 'mockfile.pdf',
  }),
}));

describe('getDocument', () => {
  const docketNumber = '101-19';
  const key = '123';

  it('should return a file from the provided url when protocol is not provided', async () => {
    const mockPdfUrl = 'www.example.com';
    applicationContext.getHttpClient.mockImplementation(() => {
      const httpClient = () => ({
        data: BLOB_DATA,
      });
      httpClient.get = () => ({
        data: { url: mockPdfUrl },
      });
      return httpClient;
    });

    const result = await getDocument({
      applicationContext,
      docketNumber,
      key,
    });

    expect((getPdfFromUrl as jest.Mock).mock.calls[0][0]).toMatchObject({
      url: mockPdfUrl,
    });
    expect(result).toEqual({ name: 'mockfile.pdf' });
  });
});
