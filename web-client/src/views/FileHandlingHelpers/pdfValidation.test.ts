jest.mock('@shared/business/utilities/pdfs/getPdfJs');
jest.mock('@shared/business/utilities/pdfs/hasDuplicateObjectNumbers');
import * as pdfValidationHelpers from './pdfValidationHelpers';
import { ErrorTypes } from '@web-client/views/FileHandlingHelpers/fileValidation';
import {
  PDF_CORRUPTED_ERROR_MESSAGE,
  PDF_PASSWORD_PROTECTED_ERROR_MESSAGE,
  PDF_UNSUPPORTED_REVISION_ERROR_MESSAGE,
  UNSUPPORTED_BROWSER_ERROR_MESSAGE,
  validatePdf,
} from './pdfValidation';
import { validatePdfHeader } from '@web-client/views/FileHandlingHelpers/pdfValidationHelpers';
import { getPdfJs as getPdfJsMock } from '@shared/business/utilities/pdfs/getPdfJs';
import { hasDuplicateObjectNumbers as hasDuplicateObjectNumbersMock } from '@shared/business/utilities/pdfs/hasDuplicateObjectNumbers';

const VALID_PDF_HEADER_BYTES = [0x25, 0x50, 0x44, 0x46, 0x2d]; // %PDF-
const INVALID_PDF_HEADER_BYTES = [0x50, 0x44, 0x46, 0x25, 0x2d]; // PFD%-

describe('validatePdfHeader', () => {
  it('should return true for valid PDF header', () => {
    const validPdfData = new Uint8Array(VALID_PDF_HEADER_BYTES);

    const result = validatePdfHeader(validPdfData);

    expect(result).toBe(true);
  });

  it('should return false for invalid PDF header', () => {
    const invalidPdfData = new Uint8Array(INVALID_PDF_HEADER_BYTES);

    const result = validatePdfHeader(invalidPdfData);

    expect(result).toBe(false);
  });
});

describe('validatePdf', () => {
  const getPdfJs = jest.mocked(getPdfJsMock);
  const hasDuplicateObjectNumbers = jest.mocked(hasDuplicateObjectNumbersMock);

  let mockFile: File;
  let mockPdfJs: any;
  let mockFileReader: any;

  beforeEach(() => {
    mockFileReader = {
      onerror: null,
      onload: null,
      readAsArrayBuffer: jest.fn(),
      result: VALID_PDF_HEADER_BYTES,
    };

    jest
      .spyOn(pdfValidationHelpers, 'validatePermissions')
      .mockResolvedValue(true);

    // @ts-expect-error
    global.FileReader = jest.fn(() => mockFileReader);

    mockFile = new File([new ArrayBuffer(8)], 'test.pdf', {
      type: 'application/pdf',
    });

    mockPdfJs = {
      getDocument: jest.fn(),
    };
    getPdfJs.mockResolvedValue(mockPdfJs);

    hasDuplicateObjectNumbers.mockResolvedValue(false);
  });

  it('should return error message for unsupported browser', async () => {
    const unsupportedBrowserError = new Error(
      UNSUPPORTED_BROWSER_ERROR_MESSAGE,
    );
    unsupportedBrowserError.name = 'UnsupportedBrowserException';
    getPdfJs.mockRejectedValueOnce(unsupportedBrowserError);

    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onload();
    const result = await resultPromise;

    expect(result).toMatchObject({
      isValid: false,
      errorInformation: {
        errorMessageToLog: expect.stringContaining(
          `${UNSUPPORTED_BROWSER_ERROR_MESSAGE}`,
        ),
        errorMessageToDisplay: expect.stringContaining(
          UNSUPPORTED_BROWSER_ERROR_MESSAGE,
        ),
        errorType: ErrorTypes.UNSUPPORTED_BROWSER,
      },
    });
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

  it('should return error message when the PDF holds one object number at two generations', async () => {
    mockPdfJs.getDocument.mockReturnValue({
      promise: Promise.resolve(),
    });
    hasDuplicateObjectNumbers.mockResolvedValue(true);

    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onload();
    const result = await resultPromise;

    expect(result).toEqual({
      errorInformation: {
        errorMessageToDisplay: PDF_UNSUPPORTED_REVISION_ERROR_MESSAGE,
        errorMessageToLog: `${PDF_UNSUPPORTED_REVISION_ERROR_MESSAGE} (DuplicateObjectNumberException)`,
        errorType: ErrorTypes.UNSUPPORTED_PDF_REVISION,
      },
      isValid: false,
    });
  });

  it('should not run the duplicate check on an encrypted PDF', async () => {
    const error = new Error();
    error.name = 'PasswordException';
    mockPdfJs.getDocument.mockReturnValue({
      promise: Promise.reject(error),
    });
    hasDuplicateObjectNumbers.mockResolvedValue(true);

    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onload();
    const result = await resultPromise;

    expect(result.errorInformation?.errorType).toBe(ErrorTypes.ENCRYPTED_FILE);
    expect(hasDuplicateObjectNumbers).not.toHaveBeenCalled();
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
        errorMessageToLog: `${PDF_PASSWORD_PROTECTED_ERROR_MESSAGE} (PasswordException)`,
        errorType: ErrorTypes.ENCRYPTED_FILE,
      },
      isValid: false,
    });
  });

  it('should return error message for readonly PDF', async () => {
    mockPdfJs.getDocument.mockReturnValue({
      promise: Promise.resolve(),
    });
    jest
      .spyOn(pdfValidationHelpers, 'validatePermissions')
      .mockResolvedValue(false);

    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onload();
    const result = await resultPromise;

    expect(result).toEqual({
      errorInformation: {
        errorMessageToDisplay: PDF_PASSWORD_PROTECTED_ERROR_MESSAGE,
        errorMessageToLog: `${PDF_PASSWORD_PROTECTED_ERROR_MESSAGE} (ReadOnlyException)`,
        errorType: ErrorTypes.ENCRYPTED_FILE,
      },
      isValid: false,
    });
  });

  it('should return error message for PDF with invalid header', async () => {
    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.result = INVALID_PDF_HEADER_BYTES;
    mockFileReader.onload();

    const result = await resultPromise;

    expect(result).toEqual({
      errorInformation: {
        errorMessageToDisplay: PDF_CORRUPTED_ERROR_MESSAGE,
        errorMessageToLog: `${PDF_CORRUPTED_ERROR_MESSAGE} (CorruptPDFHeaderException)`,
        errorType: ErrorTypes.CORRUPT_FILE,
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
        errorMessageToLog: `${PDF_CORRUPTED_ERROR_MESSAGE} (InvalidPDFException)`,
        errorType: ErrorTypes.CORRUPT_FILE,
      },
      isValid: false,
    });
  });

  it('should return the generic error message for an unrecognised exception name', async () => {
    const error = new Error();
    error.name = 'SomeOtherException';
    mockPdfJs.getDocument.mockReturnValue({
      promise: Promise.reject(error),
    });

    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onload();
    const result = await resultPromise;

    expect(result).toEqual({
      errorInformation: {
        errorMessageToDisplay:
          'There is a problem uploading the file. Try again later.',
        errorMessageToLog:
          'There is a problem uploading the file. Try again later. (An unknown error occurred: SomeOtherException)',
        errorType: ErrorTypes.UNKNOWN,
      },
      isValid: false,
    });
  });

  it('should return the generic error message when something other than an Error is thrown', async () => {
    mockPdfJs.getDocument.mockReturnValue({
      // A non-Error rejection is the case under test.
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      promise: Promise.reject('not an error object'),
    });

    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onload();
    const result = await resultPromise;

    expect(result).toEqual({
      errorInformation: {
        errorMessageToDisplay:
          'There is a problem uploading the file. Try again later.',
        errorMessageToLog:
          'There is a problem uploading the file. Try again later. (An unknown error occurred: not an error object)',
        errorType: ErrorTypes.UNKNOWN,
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
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
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
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `FileReader result is invalid for file: ${mockFile.name}. Result: null`,
    );
    consoleErrorSpy.mockRestore();
  });
});
