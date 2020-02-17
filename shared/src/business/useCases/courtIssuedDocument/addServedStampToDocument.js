const { getPageDimensions } = require('../generateSignedDocumentInteractor');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

/**
 * addServedStampToDocument
 *
 * @param {object} providers the providers object
 * @param {object} providers.pdfData the original document pdf data
 * @param {string} providers.serviceStampText the service stamp text to add to the document
 * @returns {object} the new pdf with the stamp at the bottom center of the document
 */
exports.addServedStampToDocument = async ({ pdfData, serviceStampText }) => {
  const scale = 1;
  const pdfDoc = await PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  const [originalPageWidth] = getPageDimensions(page);

  const helveticaBoldFont = pdfDoc.embedStandardFont(
    StandardFonts.HelveticaBold,
  );

  const textSize = 16 * scale;
  const padding = 3 * scale;
  const serviceStampWidth = helveticaBoldFont.widthOfTextAtSize(
    serviceStampText,
    textSize,
  );
  const textHeight = helveticaBoldFont.sizeAtHeight(textSize);
  const boxWidth = serviceStampWidth + padding * 2;
  const boxHeight = textHeight + padding * 2;
  const posX = originalPageWidth / 2 - boxWidth / 2;
  const posY = boxHeight;

  page.drawRectangle({
    color: rgb(1, 1, 1),
    height: boxHeight,
    width: boxWidth,
    x: posX,
    y: posY,
  });
  page.drawText(serviceStampText, {
    font: helveticaBoldFont,
    size: textSize,
    x: posX + padding,
    y: posY + padding,
  });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });

  return pdfBytes;
};
