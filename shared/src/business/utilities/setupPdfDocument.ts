export const setupPdfDocument = async ({
  alternateFont = false,
  applicationContext,
  pdfData,
}) => {
  const { PDFDocument, StandardFonts } = await applicationContext.getPdfLib();
  const pdfDoc = await PDFDocument.load(pdfData);

  const textFont = !alternateFont
    ? pdfDoc.embedStandardFont(StandardFonts.TimesRomanBold)
    : pdfDoc.embedFont(StandardFonts.CourierBold);

  return { pdfDoc, textFont };
};
