const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const { sanitizePdfInteractor } = require('./sanitizePdfInteractor');

describe('sanitizePdfInteractor', () => {
  const saveMock = jest.fn();

  beforeEach(() => {
    applicationContext.getPdfLib = jest.fn().mockResolvedValue({
      PDFDocument: {
        load: jest.fn().mockResolvedValue({
          getForm: () => ({ flatten: jest.fn() }),
          isEncrypted: false,
          save: saveMock,
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

  it('sanitizes a clean PDF and saves it to S3', async () => {
    const mockKey = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
    const result = await sanitizePdfInteractor(applicationContext, {
      key: mockKey,
    });
    expect(result).toBeTruthy();
    expect(saveMock).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0].key,
    ).toBe(mockKey);
  });
});
