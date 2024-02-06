import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { cleanFileMetadata, uploadPdfFromClient } from './uploadPdfFromClient';

describe('uploadPdfFromClient', () => {
  describe('Http Post', () => {
    beforeEach(() => {
      applicationContext.getPdfLib = () => ({
        catch: () => null,
      });
    });

    it('makes a post request to the expected endpoint with the expected data', async () => {
      applicationContext.getHttpClient().post.mockResolvedValue(null);

      await uploadPdfFromClient({
        applicationContext,
        file: new File([], 'abc'),
        key: '123',
        onUploadProgress: () => null,
        policy: {
          fields: {
            Policy: 'gg',
            'X-Amz-Algorithm': '1',
            'X-Amz-Credential': '2',
            'X-Amz-Date': '3',
            'X-Amz-Security-Token': '4',
            'X-Amz-Signature': '5',
          },
          url: 'http://test.com',
        },
      });

      expect(applicationContext.getHttpClient().post.mock.calls[0][0]).toEqual(
        'http://test.com',
      );
      expect([
        ...applicationContext.getHttpClient().post.mock.calls[0][1].entries(),
      ]).toMatchObject([
        ['key', '123'],
        ['X-Amz-Algorithm', '1'],
        ['X-Amz-Credential', '2'],
        ['X-Amz-Date', '3'],
        ['X-Amz-Security-Token', '4'],
        ['Policy', 'gg'],
        ['X-Amz-Signature', '5'],
        ['content-type', 'application/pdf'],
        ['file', {}],
      ]);
      expect(
        applicationContext.getHttpClient().post.mock.calls[0][2],
      ).toMatchObject({
        headers: { 'content-type': 'multipart/form-data; boundary=undefined' },
      });
    });

    it('makes use of defaults when not provided', async () => {
      await uploadPdfFromClient({
        applicationContext,
        file: new Blob([]),
        key: '123',
        onUploadProgress: () => null,
        policy: {
          fields: {
            Policy: 'gg',
            'X-Amz-Algorithm': '1',
            'X-Amz-Credential': '2',
            'X-Amz-Date': '3',
            'X-Amz-Signature': '5',
          },
          url: 'http://test.com',
        },
      });

      expect([
        ...applicationContext.getHttpClient().post.mock.calls[0][1].entries(),
      ]).toMatchObject([
        ['key', '123'],
        ['X-Amz-Algorithm', '1'],
        ['X-Amz-Credential', '2'],
        ['X-Amz-Date', '3'],
        ['X-Amz-Security-Token', ''],
        ['Policy', 'gg'],
        ['X-Amz-Signature', '5'],
        ['content-type', 'application/pdf'],
        ['file', {}],
      ]);
      expect(
        applicationContext.getHttpClient().post.mock.calls[0][2],
      ).toMatchObject({
        headers: { 'content-type': 'multipart/form-data; boundary=undefined' },
      });
    });
  });

  describe('PDF metadata "cleanFileMetadata"', () => {
    let pdfLibMock;
    let loadMock;

    const TEST_TITLE = 'TEST_TITLE';

    beforeEach(() => {
      applicationContext.getHttpClient().post.mockResolvedValue(null);

      loadMock = {
        save: jest.fn(),
        setAuthor: jest.fn(),
        setCreationDate: jest.fn(),
        setKeywords: jest.fn(),
        setModificationDate: jest.fn(),
        setSubject: jest.fn(),
        setTitle: jest.fn(),
      };

      pdfLibMock = {
        PDFDocument: {
          load: () => loadMock,
        },
        catch: () => pdfLibMock,
      };
      applicationContext.getPdfLib = () => pdfLibMock;
    });

    it('should clear out all metadata from PDF', async () => {
      const TEST_STRING =
        '<photoshop:AuthorsPosition>John is Testing</photoshop:AuthorsPosition><photoshop:CaptionWriter>.*?</photoshop:CaptionWriter><pdf:Keywords>.*?</pdf:Keywords>';

      const modifiedPdfBytes = new Uint8Array(TEST_STRING.length);
      for (let i = 0; i < TEST_STRING.length; i++) {
        modifiedPdfBytes[i] = TEST_STRING.charCodeAt(i);
      }

      loadMock.save.mockReturnValue(modifiedPdfBytes);

      const pdfBytes = await cleanFileMetadata(
        TEST_TITLE,
        pdfLibMock,
        {} as FileReader,
      );

      expect(loadMock.setTitle).toHaveBeenCalledWith(TEST_TITLE);
      expect(loadMock.setAuthor).toHaveBeenCalledWith('');
      expect(loadMock.setSubject).toHaveBeenCalledWith('');
      expect(loadMock.setKeywords).toHaveBeenCalledWith([]);
      expect(loadMock.setCreationDate).toHaveBeenCalled();
      expect(loadMock.setModificationDate).toHaveBeenCalled();

      expect(pdfBytes.toString()).toEqual('');
    });
  });
});
