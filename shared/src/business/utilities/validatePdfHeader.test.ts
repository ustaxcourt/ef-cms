import { validatePdfHeader } from '@shared/business/utilities/validatePdfHeader';

describe('validatePdfHeader', () => {
  const mockLoggerFunc = jest.fn();

  it('should return true for valid PDF header', () => {
    const validPdfData = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]); // %PDF-

    const result = validatePdfHeader(validPdfData, mockLoggerFunc);

    expect(result).toBe(true);
    expect(mockLoggerFunc).toHaveBeenCalledWith(
      'pdfHeaderBytes',
      validPdfData.slice(0, 5),
    );
    expect(mockLoggerFunc).toHaveBeenCalledWith('pdfHeaderString', '%PDF-');
  });

  it('should return false for invalid PDF header', () => {
    const invalidPdfData = new Uint8Array([0x50, 0x44, 0x46, 0x25, 0x2d]); // PFD%-

    const result = validatePdfHeader(invalidPdfData, mockLoggerFunc);

    expect(result).toBe(false);
    expect(mockLoggerFunc).toHaveBeenCalledWith(
      'pdfHeaderBytes',
      invalidPdfData.slice(0, 5),
    );
    expect(mockLoggerFunc).toHaveBeenCalledWith('pdfHeaderString', 'PDF%-');
  });

  it('should not call loggerFunc if it is not provided', () => {
    const validPdfData = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]); // %PDF-

    const result = validatePdfHeader(validPdfData);

    expect(result).toBe(true);
    expect(mockLoggerFunc).not.toHaveBeenCalled();
  });
});
