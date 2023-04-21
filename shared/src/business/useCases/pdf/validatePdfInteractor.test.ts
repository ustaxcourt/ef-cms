import { applicationContext } from '../../test/createTestApplicationContext';
import { removePdf, validatePdfInteractor } from './validatePdfInteractor';
import { testInvalidPdfDoc, testPdfDoc } from '../../test/getFakeFile';

describe('validatePdfInteractor', () => {
  const getPagesMock = jest.fn();

  beforeEach(() => {
    applicationContext.getPdfLib = jest.fn().mockResolvedValue({
      PDFDocument: {
        load: jest.fn().mockResolvedValue({
          getPages: getPagesMock,
          isEncrypted: false,
        }),
      },
    });

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });

    applicationContext.getPersistenceGateway().deleteDocumentFile = jest.fn();
  });

  it('validates a clean PDF', async () => {
    await expect(
      validatePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).resolves.not.toBeDefined();
  });

  it('throws an error and deletes the document from S3 when the PDF is encrypted', async () => {
    applicationContext.getPdfLib = jest.fn().mockResolvedValue({
      PDFDocument: {
        load: jest.fn().mockResolvedValue({
          isEncrypted: true,
        }),
      },
    });

    await expect(
      validatePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('invalid pdf');

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFile,
    ).toHaveBeenCalledWith({
      applicationContext,
      key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });

    expect(applicationContext.logger.debug.mock.calls[3][0]).toEqual(
      'PDF Invalid: Deleting from S3',
    );

    expect(applicationContext.logger.debug.mock.calls[3][1]).toEqual(
      'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    );
  });

  it('throws an error and deletes the document from S3 when the PDF is actually a png', async () => {
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testInvalidPdfDoc,
      }),
    });

    await expect(
      validatePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('invalid pdf');

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFile,
    ).toHaveBeenCalledWith({
      applicationContext,
      key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });

    expect(applicationContext.logger.debug.mock.calls[3][0]).toEqual(
      'PDF Invalid: Deleting from S3',
    );

    expect(applicationContext.logger.debug.mock.calls[3][1]).toEqual(
      'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    );
  });

  it('throws an error and deletes the document from s3 when pdf pages cannot be read', async () => {
    getPagesMock.mockImplementation(() => {
      throw new Error('cannot read pages');
    });

    await expect(
      validatePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('pdf pages cannot be read');

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFile,
    ).toHaveBeenCalledWith({
      applicationContext,
      key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });

    expect(applicationContext.logger.debug.mock.calls[3][0]).toEqual(
      'PDF Pages Unreadable: Deleting from S3',
    );

    expect(applicationContext.logger.debug.mock.calls[3][1]).toEqual(
      'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    );
  });

  describe('removePdf', () => {
    it('calls the persistence method for removing a document from S3 based on the given key', () => {
      removePdf({
        applicationContext,
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        message: 'Test!',
      });

      expect(
        applicationContext.getPersistenceGateway().deleteDocumentFile,
      ).toHaveBeenCalledWith({
        applicationContext,
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });
    });

    it('calls the debug method with the given key and message for context', () => {
      removePdf({
        applicationContext,
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
        message: 'Test Message',
      });

      expect(applicationContext.logger.debug.mock.calls[0][0]).toEqual(
        'Test Message: Deleting from S3',
      );

      expect(applicationContext.logger.debug.mock.calls[0][1]).toEqual(
        'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      );
    });

    it('calls the debug method with a generic message when one is not given', () => {
      removePdf({
        applicationContext,
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });

      expect(applicationContext.logger.debug.mock.calls[0][0]).toEqual(
        'PDF Error: Deleting from S3',
      );

      expect(applicationContext.logger.debug.mock.calls[0][1]).toEqual(
        'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      );
    });
  });
});
