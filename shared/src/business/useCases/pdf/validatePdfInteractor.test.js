const {
  applicationContext,
  testInvalidPdfDoc,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const { validatePdfInteractor } = require('./validatePdfInteractor');

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
      promise: async () => ({
        Body: testPdfDoc,
      }),
    });
  });

  it('validates a clean PDF', async () => {
    const result = await validatePdfInteractor(applicationContext, {
      key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
    });
    expect(result).toBeTruthy();
  });

  it('throws an error when pdf is encrypted', async () => {
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
  });

  it('throws an error when pdf is actually a png', async () => {
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: testInvalidPdfDoc,
      }),
    });

    await expect(
      validatePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('invalid pdf');
  });

  it('throws an error when pdf pages cannot be read', async () => {
    getPagesMock.mockImplementation(() => {
      throw new Error('cannot read pages');
    });

    await expect(
      validatePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      }),
    ).rejects.toThrow('pdf pages cannot be read');
  });
});
