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

    beforeEach(() => {
      applicationContext.getHttpClient().post.mockResolvedValue(null);

      loadMock = {
        isEncrypted: false,
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
          'FINAL<photoshop:AuthorsPosition>test</photoshop:AuthorsPosition><photoshop:CaptionWriter>.*?</photoshop:CaptionWriter><pdf:Keywords>.*?</pdf:Keywords><dc:subject>.*?</dc:subject>';

        const modifiedPdfBytes = new Uint8Array(TEST_STRING.length);
        for (let i = 0; i < TEST_STRING.length; i++) {
          modifiedPdfBytes[i] = TEST_STRING.charCodeAt(i);
        }

        loadMock.save.mockReturnValue(modifiedPdfBytes);

        const pdfContent = new Uint8Array([37, 80, 68, 70, 45, 49, 46, 51]); // bytes representing "%PDF-1.3"

        const fileReaderMock = {
          result: pdfContent,
        };

        const pdfBytes = await cleanFileMetadata(
          pdfLibMock,
          fileReaderMock as unknown as FileReader,
        );

        expect(loadMock.setTitle).toHaveBeenCalledWith('');
        expect(loadMock.setAuthor).toHaveBeenCalledWith('');
        expect(loadMock.setSubject).toHaveBeenCalledWith('');
        expect(loadMock.setKeywords).toHaveBeenCalledWith([]);
        expect(loadMock.setCreationDate).toHaveBeenCalled();
        expect(loadMock.setModificationDate).toHaveBeenCalled();

        expect(pdfBytes?.toString()).toEqual(
          new TextEncoder()
            .encode(
              'FINAL<photoshop:AuthorsPosition>    </photoshop:AuthorsPosition><photoshop:CaptionWriter>   </photoshop:CaptionWriter><pdf:Keywords>   </pdf:Keywords><dc:subject>   </dc:subject>',
            )
            .toString(),
        );
      });
    });

    describe('readAndCleanFileMetadata', () => {
      it('returns the original file if pdfLib is falsy', async () => {
        const file = new File(['file content'], 'example.pdf');
        const pdfLib = null;

        const result = await readAndCleanFileMetadata(file, pdfLib);

        expect(result).toBe(file);
      });

      it('should call the "cleanFileMetadata" method if the file is loaded and resolve', async () => {
        const file = new File(['file content'], 'example.pdf');

        const readAsArrayBufferMock = jest.fn();
        const addEventListenerMock = jest.fn((key, callback) => {
          if (key === 'load') callback();
        });

        global.FileReader = jest.fn(() => ({
          addEventListener: addEventListenerMock,
          readAsArrayBuffer: readAsArrayBufferMock,
          result: '%PDF- sample data',
        })) as any;

        await readAndCleanFileMetadata(file, pdfLibMock);

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
        const file = new File(['file content'], 'example.pdf');

        const readAsArrayBufferMock = jest.fn();
        const addEventListenerMock = jest.fn((key, callback) => {
          if (key === 'error') callback();
        });

        global.FileReader = jest.fn(() => ({
          addEventListener: addEventListenerMock,
          readAsArrayBuffer: readAsArrayBufferMock,
        })) as any;

        await expect(readAndCleanFileMetadata(file, pdfLibMock)).rejects.toBe(
          'Failed to read file',
        );
      });

      it('should return the original file if the file is encrypted', async () => {
        const TEST_STRING =
          'FINAL<photoshop:AuthorsPosition>test</photoshop:AuthorsPosition><photoshop:CaptionWriter>.*?</photoshop:CaptionWriter><pdf:Keywords>.*?</pdf:Keywords>';

        const pdfDocMock = {
          isEncrypted: true,
          setAuthor: jest.fn(),
          setCreationDate: jest.fn(),
          setKeywords: jest.fn(),
          setModificationDate: jest.fn(),
          setSubject: jest.fn(),
          setTitle: jest.fn(),
        };

        const pdfLibMock2 = {
          PDFDocument: {
            load: jest.fn().mockResolvedValue(pdfDocMock),
          },
        };

        const fileReader = {
          result: TEST_STRING,
        };

        const pdfBytes = await cleanFileMetadata(
          pdfLibMock2,
          fileReader as any,
        );

        expect(pdfBytes?.toString()).toEqual(TEST_STRING);
        expect(pdfDocMock.setTitle).not.toHaveBeenCalled();
        expect(pdfDocMock.setAuthor).not.toHaveBeenCalled();
        expect(pdfDocMock.setSubject).not.toHaveBeenCalled();
        expect(pdfDocMock.setKeywords).not.toHaveBeenCalled();
        expect(pdfDocMock.setCreationDate).not.toHaveBeenCalled();
        expect(pdfDocMock.setModificationDate).not.toHaveBeenCalled();
      });

      it('should return the original file when the file is not a valid PDF file', async () => {
        const TEST_STRING = 'This is not a PDF file.';

        const pdfLibMock2 = {
          PDFDocument: {
            load: jest.fn().mockRejectedValue(new Error('Invalid PDF format')),
          },
        };

        const fileReader = {
          result: TEST_STRING,
        };

        const pdfDocMock = {
          isEncrypted: false,
          save: jest.fn(),
          setAuthor: jest.fn(),
          setCreationDate: jest.fn(),
          setKeywords: jest.fn(),
          setModificationDate: jest.fn(),
          setSubject: jest.fn(),
          setTitle: jest.fn(),
        };

        pdfLibMock.PDFDocument.load.mockResolvedValue(pdfDocMock);

        const pdfBytes = await cleanFileMetadata(
          pdfLibMock2,
          fileReader as any,
        );

        expect(pdfBytes?.toString()).toEqual(TEST_STRING);
        expect(loadMock.setTitle).not.toHaveBeenCalled();
        expect(loadMock.setAuthor).not.toHaveBeenCalled();
        expect(loadMock.setSubject).not.toHaveBeenCalled();
        expect(loadMock.setKeywords).not.toHaveBeenCalled();
        expect(loadMock.setCreationDate).not.toHaveBeenCalled();
        expect(loadMock.setModificationDate).not.toHaveBeenCalled();
      });

      it('should return the original file if the file is corrupted', async () => {
        const TEST_STRING = 'This is not a PDF file.';

        const fileReader = {
          result: TEST_STRING,
        };

        const pdfDocMock = {
          isEncrypted: false,
          save: jest.fn(),
          setAuthor: jest.fn(),
          setCreationDate: jest.fn(),
          setKeywords: jest.fn(),
          setModificationDate: jest.fn(),
          setSubject: jest.fn(),
          setTitle: jest.fn(),
        };

        pdfLibMock.PDFDocument.load.mockResolvedValue(pdfDocMock);

        const pdfBytes = await cleanFileMetadata(pdfLibMock, fileReader as any);

        expect(pdfBytes?.toString()).toEqual(TEST_STRING);
        expect(loadMock.setTitle).not.toHaveBeenCalled();
        expect(loadMock.setAuthor).not.toHaveBeenCalled();
        expect(loadMock.setSubject).not.toHaveBeenCalled();
        expect(loadMock.setKeywords).not.toHaveBeenCalled();
        expect(loadMock.setCreationDate).not.toHaveBeenCalled();
        expect(loadMock.setModificationDate).not.toHaveBeenCalled();
      });
    });
  });
});
