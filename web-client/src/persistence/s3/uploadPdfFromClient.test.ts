import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  cleanFileMetadata,
  readAndCleanFileMetadata,
  uploadPdfFromClient,
} from './uploadPdfFromClient';

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
      applicationContext.getPdfLib = () => ({
        catch: () => ({}),
      });

      const readAsArrayBufferMock = jest.fn();
      const addEventListenerMock = jest.fn((key, callback) => {
        if (key === 'error') callback();
      });

      global.FileReader = jest.fn(() => ({
        addEventListener: addEventListenerMock,
        readAsArrayBuffer: readAsArrayBufferMock,
      })) as any;

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

  describe('PDF metadata', () => {
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
          load: jest.fn(() => loadMock),
        },
        catch: () => pdfLibMock,
      };
      applicationContext.getPdfLib = () => pdfLibMock;
    });

    describe('cleanFileMetadata', () => {
      it('should clear out all metadata from PDF', async () => {
        const TEST_STRING =
          'FINAL<photoshop:AuthorsPosition>test</photoshop:AuthorsPosition><photoshop:CaptionWriter>.*?</photoshop:CaptionWriter><pdf:Keywords>.*?</pdf:Keywords>';

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

        expect(pdfBytes.toString()).toEqual(
          new TextEncoder()
            .encode(
              "'FINAL<photoshop:AuthorsPosition>    </photoshop:AuthorsPosition><photoshop:CaptionWriter>   </photoshop:CaptionWriter><pdf:Keywords>   </pdf:Keywords>'",
            )
            .toString(),
        );
      });
    });

    describe('readAndCleanFileMetadata', () => {
      it('returns the original file if pdfLib is falsy', async () => {
        const title = 'example';
        const file = new File(['file content'], 'example.pdf');
        const pdfLib = null;

        const result = await readAndCleanFileMetadata(title, file, pdfLib);

        expect(result).toBe(file);
      });

      it('should call the "cleanFileMetadata" method if the file is loaded and resolve', async () => {
        const title = 'example';
        const file = new File(['file content'], 'example.pdf');

        const readAsArrayBufferMock = jest.fn();
        const addEventListenerMock = jest.fn((key, callback) => {
          if (key === 'load') callback();
        });

        global.FileReader = jest.fn(() => ({
          addEventListener: addEventListenerMock,
          readAsArrayBuffer: readAsArrayBufferMock,
        })) as any;

        await readAndCleanFileMetadata(title, file, pdfLibMock);

        expect(readAsArrayBufferMock).toHaveBeenCalledWith(file);

        expect(addEventListenerMock).toHaveBeenCalledWith(
          'load',
          expect.any(Function),
        );
        expect(addEventListenerMock).toHaveBeenCalledWith(
          'error',
          expect.any(Function),
        );

        expect(pdfLibMock.PDFDocument.load).toHaveBeenCalled();
      });

      it('should throw an error if the file reader rejects with an error', async () => {
        const title = 'example';
        const file = new File(['file content'], 'example.pdf');

        const readAsArrayBufferMock = jest.fn();
        const addEventListenerMock = jest.fn((key, callback) => {
          if (key === 'error') callback();
        });

        global.FileReader = jest.fn(() => ({
          addEventListener: addEventListenerMock,
          readAsArrayBuffer: readAsArrayBufferMock,
        })) as any;

        await expect(
          readAndCleanFileMetadata(title, file, pdfLibMock),
        ).rejects.toBe('Failed to read file');
      });
    });
  });
});
