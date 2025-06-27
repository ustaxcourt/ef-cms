jest.mock('@shared/business/utilities/pdfs/getPdfJs');
import * as pdfValidationHelpers from './pdfValidationHelpers';
import { ErrorTypes } from '@web-client/views/FileHandlingHelpers/fileValidation';
import {
  PDF_CORRUPTED_ERROR_MESSAGE,
  PDF_PASSWORD_PROTECTED_ERROR_MESSAGE,
  UNSUPPORTED_BROWSER_ERROR_MESSAGE,
  validatePdf,
} from './pdfValidation';
import { validatePdfHeader } from '@web-client/views/FileHandlingHelpers/pdfValidationHelpers';
import { getPdfJs as getPdfJsMock } from '@shared/business/utilities/pdfs/getPdfJs';

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

  let mockFile: File;
  let mockPdfJs: any;
  let mockFileReader: any;
  let originalUserAgent: string;

  beforeEach(() => {
    // Store original navigator.userAgent
    originalUserAgent = navigator.userAgent;

    // Set up a modern user agent by default
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
    });

    mockFileReader = {
      onerror: null,
      onload: null,
      readAsArrayBuffer: jest.fn(),
      result: VALID_PDF_HEADER_BYTES,
    };

    // Mock FileReader globally
    global.FileReader = jest.fn(
      () => mockFileReader,
    ) as unknown as typeof FileReader;
    Object.assign(global.FileReader, {
      EMPTY: 0,
      LOADING: 1,
      DONE: 2,
    });

    jest
      .spyOn(pdfValidationHelpers, 'validatePermissions')
      .mockResolvedValue(true);

    jest.spyOn(pdfValidationHelpers, 'validatePdfHeader').mockReturnValue(true);

    (global as any).FileReader = jest.fn(() => mockFileReader);

    mockFile = new File([new ArrayBuffer(8)], 'test.pdf', {
      type: 'application/pdf',
    });

    mockPdfJs = {
      getDocument: jest.fn().mockReturnValue({
        promise: Promise.resolve({
          // Mock PDF document
          destroy: jest.fn().mockResolvedValue(undefined),
        }),
      }),
    };
    getPdfJs.mockResolvedValue(mockPdfJs);

    mockFile = new File([new ArrayBuffer(8)], 'test.pdf', {
      type: 'application/pdf',
    });
  });

  afterEach(() => {
    // Restore original navigator.userAgent
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: originalUserAgent,
    });

    jest.resetAllMocks();
  });

  const mockUserAgent = (userAgent: string) => {
    Object.defineProperty(navigator, 'userAgent', {
      configurable: true,
      value: userAgent,
    });
  };
  
  describe('browser compatibility checks', () => {
    it('should reject old Chrome browser (version < 84)', async () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.3945.130 Safari/537.36');
      
      const result = await validatePdf({ file: mockFile });
      
      expect(result).toEqual({
        errorInformation: {
          errorMessageToDisplay: UNSUPPORTED_BROWSER_ERROR_MESSAGE,
          errorMessageToLog: expect.stringContaining(UNSUPPORTED_BROWSER_ERROR_MESSAGE),
          errorType: ErrorTypes.UNSUPPORTED_BROWSER,
        },
        isValid: false,
      });
    });
    
    it('should reject old Firefox browser (version < 90)', async () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0');
      
      const result = await validatePdf({ file: mockFile });
      
      expect(result).toEqual({
        errorInformation: {
          errorMessageToDisplay: UNSUPPORTED_BROWSER_ERROR_MESSAGE,
          errorMessageToLog: expect.stringContaining(UNSUPPORTED_BROWSER_ERROR_MESSAGE),
          errorType: ErrorTypes.UNSUPPORTED_BROWSER,
        },
        isValid: false,
      });
    });
    
    it('should reject old Safari browser (version < 16)', async () => {
      mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Safari/605.1.15');
      
      const result = await validatePdf({ file: mockFile });
      
      expect(result).toEqual({
        errorInformation: {
          errorMessageToDisplay: UNSUPPORTED_BROWSER_ERROR_MESSAGE,
          errorMessageToLog: expect.stringContaining(UNSUPPORTED_BROWSER_ERROR_MESSAGE),
          errorType: ErrorTypes.UNSUPPORTED_BROWSER,
        },
        isValid: false,
      });
    });
    
    it('should reject Internet Explorer', async () => {
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko');
      
      const result = await validatePdf({ file: mockFile });
      
      expect(result).toEqual({
        errorInformation: {
          errorMessageToDisplay: UNSUPPORTED_BROWSER_ERROR_MESSAGE,
          errorMessageToLog: expect.stringContaining(UNSUPPORTED_BROWSER_ERROR_MESSAGE),
          errorType: ErrorTypes.UNSUPPORTED_BROWSER,
        },
        isValid: false,
      });
    });
    
    it('should accept modern browsers', async () => {
      // Chrome 110
      mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');
      
      // Trigger the file reader onload event to simulate file reading completion
      const resultPromise = validatePdf({ file: mockFile });
      mockFileReader.onload?.();
      const result = await resultPromise;
      
      // We only expect it not to fail due to browser compatibility
      // The actual validation depends on other tests
      expect(result.errorInformation?.errorType).not.toBe(ErrorTypes.UNSUPPORTED_BROWSER);
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

  it('should reject a PDF with invalid header', async () => {
    // Mock validatePdfHeader to return false for this test
    jest
      .spyOn(pdfValidationHelpers, 'validatePdfHeader')
      .mockReturnValue(false);

    const resultPromise = validatePdf({ file: mockFile });

    // We need to manually trigger the onload callback so FileReader.result is used
    mockFileReader.onload();

    const result = await resultPromise;

    expect(result).toEqual({
      errorInformation: {
        errorMessageToDisplay: PDF_CORRUPTED_ERROR_MESSAGE,
        errorMessageToLog: `${PDF_CORRUPTED_ERROR_MESSAGE} (CorruptPDFHeaderException)`,
        errorType: ErrorTypes.CORRUPT_FILE, // Make sure this matches your actual ErrorTypes enum
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
