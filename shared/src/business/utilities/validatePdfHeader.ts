import { StringDecoder } from 'string_decoder';

export const validatePdfHeader = (
  pdfData: Uint8Array,
  loggerFunc?: (message: any, context?: any) => {},
): boolean => {
  const stringDecoder = new StringDecoder('utf8');
  const pdfHeaderBytes = pdfData.slice(0, 5);
  const pdfHeaderString = stringDecoder.write(pdfHeaderBytes);
  if (loggerFunc) {
    loggerFunc('pdfHeaderBytes', pdfHeaderBytes);
    loggerFunc('pdfHeaderString', pdfHeaderString);
  }
  return pdfHeaderString === '%PDF-';
};
