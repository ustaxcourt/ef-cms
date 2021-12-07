const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  sanitizePdfInteractor,
  setPdfFields,
} = require('./sanitizePdfInteractor');

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

    applicationContext.getPersistenceGateway().deleteDocumentFromS3 = jest.fn();

    applicationContext.getUseCaseHelpers().setPdfFields = jest.fn();
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

  it('calls setPdfFields when PDF has form fields', async () => {
    const fields = ['textField', 'checkbox'];
    getFieldsMock.mockReturnValueOnce(fields);

    await expect(
      sanitizePdfInteractor(applicationContext, {
        key: 'abc',
      }),
    ).resolves.not.toBeDefined();

    expect(
      applicationContext.getUseCaseHelpers().setPdfFields,
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

describe('setFields function', () => {
  const getTextMock = jest.fn();
  const setTextMock = jest.fn();
  let name = 'PDFButton';
  let fields;

  beforeEach(() => {
    fields = [
      {
        constructor: { name },
        getText: getTextMock.mockReturnValue(''),
        setText: setTextMock,
      },
      {
        constructor: { name },
        getText: getTextMock.mockReturnValue(''),
        setText: setTextMock,
      },
    ];
  });

  it('should call getText and setText functions if field type name is PDFTextField', () => {
    const loremText = 'Lorem Ipsum';
    getTextMock.mockReturnValueOnce(loremText);
    fields[0].constructor.name = 'PDFTextField';

    setPdfFields(fields);

    expect(getTextMock).toHaveBeenCalledTimes(1);
    expect(setTextMock).toHaveBeenCalledWith(loremText);
  });

  it('should not call getText and setText functions if field type name is not PDFTextField', () => {
    fields[0].constructor.name = 'PDFCheckbox';

    setPdfFields(fields);

    expect(getTextMock).not.toHaveBeenCalled();
    expect(setTextMock).not.toHaveBeenCalled();
  });
});
