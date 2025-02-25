import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api';

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
