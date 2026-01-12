import { getPdfLib } from '@shared/business/utilities/pdfs/getPdfLib';

export const combineTwoPdfs = async ({ firstPdf, secondPdf }) => {
  const { PDFDocument } = await getPdfLib();

  const fullDocument = await PDFDocument.create();
  const firstPdfPages = await PDFDocument.load(firstPdf);
  const secondPdfPages = await PDFDocument.load(secondPdf);

  let copiedPages = await fullDocument.copyPages(
    firstPdfPages,
    firstPdfPages.getPageIndices(),
  );
  copiedPages.forEach(page => {
    fullDocument.addPage(page);
  });

  copiedPages = await fullDocument.copyPages(
    secondPdfPages,
    secondPdfPages.getPageIndices(),
  );
  copiedPages.forEach(page => {
    fullDocument.addPage(page);
  });

  return fullDocument.save();
};
