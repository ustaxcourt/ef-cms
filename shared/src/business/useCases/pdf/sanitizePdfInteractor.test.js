const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const { sanitizePdfInteractor } = require('./sanitizePdfInteractor');

describe('sanitizePdfInteractor', () => {
  const saveMock = jest.fn();

  const getFieldsMock = jest.fn();

  beforeEach(() => {
    applicationContext.getPdfLib = jest.fn().mockResolvedValue({
      PDFDocument: {
        load: jest.fn().mockResolvedValue({
          getForm: () => ({ flatten: jest.fn(), getFields: getFieldsMock }),
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

    getFieldsMock.mockReturnValue([]);
  });

  it('sanitizes a PDF containing form fields and saves it to S3', async () => {
    getFieldsMock.mockReturnValueOnce(['button', 'checkbox']);

    const mockKey = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
    await expect(
      sanitizePdfInteractor(applicationContext, {
        key: mockKey,
      }),
    ).resolves.not.toBeDefined();

    expect(saveMock).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0].key,
    ).toBe(mockKey);
  });

  it('calls setPdfFormFields when PDF has form fields', async () => {
    const fields = ['textField', 'checkbox'];
    getFieldsMock.mockReturnValueOnce(fields);

    await expect(
      sanitizePdfInteractor(applicationContext, {
        key: 'abc',
      }),
    ).resolves.not.toBeDefined();

    expect(
      applicationContext.getUseCaseHelpers().setPdfFormFields,
    ).toHaveBeenCalledWith(fields);
  });

  it('does not attempt to save a PDF that has no form fields', async () => {
    const mockKey = 'a6b81f4d-1e47-423a-8caf-6d2fdc3d3859';
    await expect(
      sanitizePdfInteractor(applicationContext, {
        key: mockKey,
      }),
    ).resolves.not.toBeDefined();
    expect(saveMock).not.toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).not.toHaveBeenCalled();
  });
});
