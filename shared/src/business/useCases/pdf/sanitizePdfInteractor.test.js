const {
  applicationContext,
  testInvalidPdfDoc,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const { sanitizePdfInteractor } = require('./sanitizePdfInteractor');

describe('sanitizePdfInteractor', () => {
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

    applicationContext.getPersistenceGateway().deleteDocumentFromS3 = jest.fn();
  });

  it('sanitizes a clean PDF', async () => {
    const result = await sanitizePdfInteractor(applicationContext, {
      key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
    expect(result).toBeTruthy();
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
      sanitizePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('invalid pdf');

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFromS3,
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
      sanitizePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('invalid pdf');

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFromS3,
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
      sanitizePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('pdf pages cannot be read');

    expect(
      applicationContext.getPersistenceGateway().deleteDocumentFromS3,
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
});
