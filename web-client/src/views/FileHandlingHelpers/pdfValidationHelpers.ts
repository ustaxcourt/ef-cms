import { PDFDocumentProxy } from 'pdfjs-dist';

export const validatePdfHeader = (pdfData: Uint8Array): boolean => {
  const stringDecoder = new TextDecoder('utf8');
  const pdfHeaderBytes = pdfData.slice(0, 5);
  const pdfHeaderString = stringDecoder.decode(pdfHeaderBytes);
  return pdfHeaderString === '%PDF-';
};

export const validatePermissions = async (
  pdfDocument: PDFDocumentProxy,
): Promise<boolean> => {
  const permissions = await pdfDocument.getPermissions();
  return !permissions;
};

export const getPdfErrorDetails = (error): string => {
  if (error === null) return 'null';
  if (typeof error === 'undefined') return 'undefined';

  if (error instanceof Error || error instanceof DOMException)
    return error.message || error.name || 'Error object without message';

  if (typeof error === 'object') {
    try {
      return `Object with properties: ${Object.keys(error).join(', ')}`;
    } catch {
      return 'Unserializable object';
    }
  }

  return error.toString();
};
