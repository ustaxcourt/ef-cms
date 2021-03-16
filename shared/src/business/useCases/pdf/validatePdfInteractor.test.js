const {
  applicationContext,
  testInvalidPdfDoc,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const { validatePdfInteractor } = require('./validatePdfInteractor');

describe('validatePdfInteractor', () => {
  beforeEach(() => {
    applicationContext.getPdfLib = jest.fn().mockResolvedValue({
      PDFDocument: {
        load: jest.fn().mockResolvedValue({
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

  it('validates an encrypted PDF', async () => {
    applicationContext.getPdfLib = jest.fn().mockResolvedValue({
      PDFDocument: {
        load: jest.fn().mockResolvedValue({
          isEncrypted: true,
        }),
      },
    });

    let error;
    try {
      await validatePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('invalid pdf');
  });

  it('validates an invalid PDF', async () => {
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: testInvalidPdfDoc,
      }),
    });

    let error;
    try {
      await validatePdfInteractor(applicationContext, {
        key: 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toEqual('invalid pdf');
  });
});
