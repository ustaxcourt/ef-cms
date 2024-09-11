import { ErrorTypes } from '@web-client/views/FileHandlingHelpers/fileValidation';
import {
  PDF_CORRUPTED_ERROR_MESSAGE,
  PDF_PASSWORD_PROTECTED_ERROR_MESSAGE,
  validatePdf,
} from './pdfValidation';
import { applicationContext } from '@web-client/applicationContext';

describe('validatePdf', () => {
  let mockFile: File;
  let mockPdfJs: any;
  let mockFileReader: any;

  beforeEach(() => {
    mockFileReader = {
      onerror: null,
      onload: null,
      readAsArrayBuffer: jest.fn(),
      result: new ArrayBuffer(8),
    };

    (global as any).FileReader = jest.fn(() => mockFileReader);

    mockFile = new File([new ArrayBuffer(8)], 'test.pdf', {
      type: 'application/pdf',
    });

    mockPdfJs = {
      getDocument: jest.fn(),
    };
    applicationContext.getPdfJs = jest.fn().mockResolvedValue(mockPdfJs);
  });

  it('should resolve as valid when the PDF is valid', async () => {
    mockPdfJs.getDocument.mockReturnValue({
      promise: Promise.resolve(),
    });

    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onload();
    const result = await resultPromise;

    expect(result).toEqual({ isValid: true });
  });

  it('should return error message for password-protected PDF', async () => {
    const error = new Error();
    error.name = 'PasswordException';
    mockPdfJs.getDocument.mockReturnValue({
      promise: Promise.reject(error),
    });

    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onload();
    const result = await resultPromise;

    expect(result).toEqual({
      errorInformation: {
        errorMessageToDisplay: PDF_PASSWORD_PROTECTED_ERROR_MESSAGE,
        errorType: ErrorTypes.ENCRYPTED_FILE,
      },
      isValid: false,
    });
  });

  it('should return error message for corrupted PDF', async () => {
    const error = new Error();
    error.name = 'InvalidPDFException';
    mockPdfJs.getDocument.mockReturnValue({
      promise: Promise.reject(error),
    });

    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onload();
    const result = await resultPromise;

    expect(result).toEqual({
      errorInformation: {
        errorMessageToDisplay: PDF_CORRUPTED_ERROR_MESSAGE,
        errorType: ErrorTypes.CORRUPT_FILE,
      },
      isValid: false,
    });
  });

  it('should return error message if FileReader encounters an error', async () => {
    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onerror();
    const result = await resultPromise;

    expect(result).toEqual({
      errorInformation: {
        errorMessageToDisplay:
          'There is a problem uploading the file. Try again later.',
        errorMessageToLog:
          'There is a problem uploading the file. Try again later. (FileReader encountered an error: Unknown error.)',
        errorType: ErrorTypes.UNKNOWN,
      },
      isValid: false,
    });
  });

  it('should return error message if FileReader result is invalid', async () => {
    mockFileReader.result = null;

    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onload();
    const result = await resultPromise;

    expect(result).toEqual({
      errorInformation: {
        errorMessageToDisplay:
          'There is a problem uploading the file. Try again later.',
        errorMessageToLog:
          'There is a problem uploading the file. Try again later. (Failed to read file as ArrayBuffer.)',
        errorType: ErrorTypes.UNKNOWN,
      },
      isValid: false,
    });
  });
});
