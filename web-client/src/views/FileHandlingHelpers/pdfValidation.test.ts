import * as pdfValidationHelpers from './pdfValidationHelpers';
import { ErrorTypes } from '@web-client/views/FileHandlingHelpers/fileValidation';
import {
  PDF_CORRUPTED_ERROR_MESSAGE,
  PDF_PASSWORD_PROTECTED_ERROR_MESSAGE,
  validatePdf,
} from './pdfValidation';
import { applicationContext } from '@web-client/applicationContext';
import { validatePdfHeader } from '@web-client/views/FileHandlingHelpers/pdfValidationHelpers';

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
