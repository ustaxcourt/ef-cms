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
      errorMessage: PDF_PASSWORD_PROTECTED_ERROR_MESSAGE,
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
      errorMessage: PDF_CORRUPTED_ERROR_MESSAGE,
      isValid: false,
    });
  });

  it('should return error message if FileReader encounters an error', async () => {
    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onerror();
    const result = await resultPromise;

    expect(result).toEqual({
      errorMessage: 'Error reading the file.',
      isValid: false,
    });
  });

  it('should return error message if FileReader result is invalid', async () => {
    mockFileReader.result = null;

    const resultPromise = validatePdf({ file: mockFile });
    mockFileReader.onload();
    const result = await resultPromise;

    expect(result).toEqual({
      errorMessage: 'Failed to read file as ArrayBuffer.',
      isValid: false,
    });
  });
});
