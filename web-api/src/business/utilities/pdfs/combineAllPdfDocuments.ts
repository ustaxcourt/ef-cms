import { PDFDocument as PDFDocumentType } from 'pdf-lib';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const combineAllPdfDocuments = async (
  applicationContext: ServerApplicationContext,
  allPDFDocuments: PDFDocumentType[],
): Promise<PDFDocumentType> => {
  const { PDFDocument } = await applicationContext.getPdfLib();
  const mergedPdf = await PDFDocument.create();
  if (allPDFDocuments.length === 0) return mergedPdf;
  if (allPDFDocuments.length === 1) return allPDFDocuments[0];

  for (const pdfDoc of allPDFDocuments) {
    const copiedPages = await mergedPdf.copyPages(
      pdfDoc,
      pdfDoc.getPageIndices(),
    );
    copiedPages.forEach(page => mergedPdf.addPage(page));
  }

  return mergedPdf;
};
