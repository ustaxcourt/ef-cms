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
import {
  getPdfJs as getPdfJsMock,
  clientSupportsES2022 as clientSupportsES2022Mock,
} from '@shared/business/utilities/pdfs/getPdfJs';

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
  const clientSupportsES2022MockFn = jest.mocked(clientSupportsES2022Mock);

  let mockFile: File;
  let mockPdfJs: any;
  let mockFileReader: any;
  let originalUserAgent: string;

  beforeEach(() => {
    // Store original navigator.userAgent
    originalUserAgent = navigator.userAgent;


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
    clientSupportsES2022MockFn.mockReturnValue(true);

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

  describe('browser compatibility checks and feature detection', () => {
    it('should reject old Safari browser (version < 16)', async () => {
      // Don't mock clientSupportsES2022 - let it run its real logic
      // which includes checking Safari version
      const actualPdfJsModule = jest.requireActual(
        '@shared/business/utilities/pdfs/getPdfJs',
      );
      clientSupportsES2022MockFn.mockImplementation(
        actualPdfJsModule.clientSupportsES2022,
      );

      // Set Safari 15.6 user agent
      mockUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15',
      );

      // This should reject immediately without any FileReader interaction
      const result = await validatePdf({ file: mockFile });

      expect(result).toEqual({
        errorInformation: {
          errorMessageToDisplay: UNSUPPORTED_BROWSER_ERROR_MESSAGE,
          errorMessageToLog: expect.stringContaining(
            UNSUPPORTED_BROWSER_ERROR_MESSAGE,
          ),
          errorType: ErrorTypes.UNSUPPORTED_BROWSER,
        },
        isValid: false,
      });
    });

    it('should accept modern Safari browser (version >= 16)', async () => {
      // Use real implementation
      const actualPdfJsModule = jest.requireActual(
        '@shared/business/utilities/pdfs/getPdfJs',
      );
      clientSupportsES2022MockFn.mockImplementation(
        actualPdfJsModule.clientSupportsES2022,
      );

      // Set Safari 16.1 user agent (should be accepted)
      mockUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
      );

      // Mock successful PDF validation
      mockPdfJs.getDocument.mockReturnValue({
        promise: Promise.resolve({
          destroy: jest.fn().mockResolvedValue(undefined),
        }),
      });

      const resultPromise = validatePdf({ file: mockFile });
      mockFileReader.onload?.();
      const result = await resultPromise;

      // Should NOT fail due to browser compatibility
      expect(result.errorInformation?.errorType).not.toBe(
        ErrorTypes.UNSUPPORTED_BROWSER,
      );
      expect(result.isValid).toBe(true);
    });

    it('should reject browsers missing ES2022 features (by manipulating environment)', async () => {
      // Use real implementation but manipulate the environment
      const actualPdfJsModule = jest.requireActual(
        '@shared/business/utilities/pdfs/getPdfJs',
      );
      clientSupportsES2022MockFn.mockImplementation(
        actualPdfJsModule.clientSupportsES2022,
      );

      // Store original features
      // @ts-ignore
      const originalHasOwn = Object.hasOwn;
      const originalStructuredClone = (global as any).structuredClone;
      const originalArrayAt = Array.prototype.at;

      try {
        // Remove ES2022 features to simulate unsupported browser
        delete (Object as any).hasOwn;
        delete (global as any).structuredClone;
        delete (Array.prototype as any).at;

        // Use modern Chrome user agent but missing features
        mockUserAgent(
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
        );

        const result = await validatePdf({ file: mockFile });

        expect(result).toEqual({
          errorInformation: {
            errorMessageToDisplay: UNSUPPORTED_BROWSER_ERROR_MESSAGE,
            errorMessageToLog: expect.stringContaining(
              UNSUPPORTED_BROWSER_ERROR_MESSAGE,
            ),
            errorType: ErrorTypes.UNSUPPORTED_BROWSER,
          },
          isValid: false,
        });
      } finally {
        // Restore original features
        // @ts-ignore
        Object.hasOwn = originalHasOwn;
        (global as any).structuredClone = originalStructuredClone;
        Array.prototype.at = originalArrayAt;
      }
    });
    it('should accept browsers with all required features', async () => {
      // Use real implementation
      const actualPdfJsModule = jest.requireActual(
        '@shared/business/utilities/pdfs/getPdfJs',
      );
      clientSupportsES2022MockFn.mockImplementation(
        actualPdfJsModule.clientSupportsES2022,
      );

      // Ensure all ES2022 features are present (they should be in test environment)
      // Use modern Chrome user agent
      mockUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
      );

      // Mock successful PDF validation
      mockPdfJs.getDocument.mockReturnValue({
        promise: Promise.resolve({
          destroy: jest.fn().mockResolvedValue(undefined),
        }),
      });

      const resultPromise = validatePdf({ file: mockFile });
      mockFileReader.onload?.();
      const result = await resultPromise;

      // Should NOT fail due to browser compatibility
      expect(result.errorInformation?.errorType).not.toBe(
        ErrorTypes.UNSUPPORTED_BROWSER,
      );
      expect(result.isValid).toBe(true);
    });

    it('should handle explicit ES2022 feature detection failure', async () => {
      // Mock to return false (simulating missing ES2022 features)
      // This tests the validation logic when clientSupportsES2022 returns false
      clientSupportsES2022MockFn.mockReturnValue(false);

      const result = await validatePdf({ file: mockFile });

      expect(result).toEqual({
        errorInformation: {
          errorMessageToDisplay: UNSUPPORTED_BROWSER_ERROR_MESSAGE,
          errorMessageToLog: expect.stringContaining(
            UNSUPPORTED_BROWSER_ERROR_MESSAGE,
          ),
          errorType: ErrorTypes.UNSUPPORTED_BROWSER,
        },
        isValid: false,
      });
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
