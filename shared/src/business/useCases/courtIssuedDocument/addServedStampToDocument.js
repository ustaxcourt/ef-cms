const { computeCoordinates } = require('../generateSignedDocumentInteractor');

const getPageDimensionsWithTrim = page => {
  const size = page.getTrimBox();
  return { pageHeight: size.height, pageWidth: size.width, startingY: size.y };
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
    degrees,
    PDFDocument,
    rgb,
    StandardFonts,
  } = await applicationContext.getPdfLib();

  const scale = 1;
  const pdfDoc = await PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  const { pageHeight, pageWidth, startingY } = getPageDimensionsWithTrim(page);

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

  const rotationAngle = page.getRotation().angle;
  const shouldRotateStamp = rotationAngle !== 0;
  const rotateSignatureDegrees = degrees(rotationAngle);

  const { rectangleX } = computeCoordinates({
    boxHeight,
    boxWidth,
    lineHeight: textHeight / 2,
    nameTextWidth: textHeight / 2,
    pageHeight,
    pageRotation: rotationAngle,
    pageWidth,
    posX,
    posY,
    scale,
    textHeight,
    titleTextWidth: textHeight / 2,
  });

  const rotate = shouldRotateStamp ? rotateSignatureDegrees : degrees(0);

  page.drawRectangle({
    color: rgb(1, 1, 1),
    height: boxHeight,
    rotate,
    width: boxWidth,
    x: rectangleX,
    y: padding,
  });
  page.drawText(serviceStampText, {
    font: helveticaBoldFont,
    rotate,
    size: textSize,
    x: rectangleX + padding,
    y: padding * 2,
  });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });

  return pdfBytes;
};
