const getPageDimensionsWithTrim = page => {
  const size = page.getTrimBox();
  return { pageWidth: size.width, startingY: size.y };
};

/**
 * addServedStampToDocument
 *
 * @param {object} providers the providers object
 * @param {object} providers.pdfData the original document pdf data
 * @param {string} providers.serviceStampText the service stamp text to add to the document
 * @returns {object} the new pdf with the stamp at the bottom center of the document
 */
exports.addServedStampToDocument = async ({
  applicationContext,
  pdfData,
  serviceStampText,
}) => {
  if (!serviceStampText) {
    serviceStampText = `SERVED ${applicationContext
      .getUtilities()
      .formatNow('MM/DD/YY')}`;
  }

  const {
    PDFDocument,
    rgb,
    StandardFonts,
  } = await applicationContext.getPdfLib();

  const scale = 1;
  const pdfDoc = await PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  const { pageWidth, startingY } = getPageDimensionsWithTrim(page);

  const helveticaBoldFont = pdfDoc.embedStandardFont(
    StandardFonts.HelveticaBold,
  );

  const textSize = 14 * scale;
  const padding = 3 * scale;
  const serviceStampWidth = helveticaBoldFont.widthOfTextAtSize(
    serviceStampText,
    textSize,
  );
  const textHeight = helveticaBoldFont.sizeAtHeight(textSize);
  const boxWidth = serviceStampWidth + padding * 2;
  const boxHeight = textHeight + padding * 2;
  const posX = pageWidth / 2 - boxWidth / 2;
  const posY = startingY + padding * 2;

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
    y: posY + padding * 2,
  });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });

  return pdfBytes;
};
