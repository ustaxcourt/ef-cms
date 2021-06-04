const {
  getCropBoxCoordinates,
} = require('../generateSignedDocumentInteractor');

const computeCoordinates = ({
  boxHeight,
  boxWidth,
  cropBoxCoordinates,
  pageHeight,
  pageRotation,
  pageWidth,
}) => {
  const rotationRads = (pageRotation * Math.PI) / 180;
  const coordsFromBottomLeft = {
    x: pageWidth / 2 - boxWidth / 2,
    y: cropBoxCoordinates.y + boxHeight + PADDING * 2,
  };

  let rectangleX, rectangleY;
  if (pageRotation === 90) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads) +
      pageWidth;
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads);
  } else if (pageRotation === 180) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads) +
      pageWidth;
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads) +
      pageHeight;
  } else if (pageRotation === 270) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads);
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads) +
      pageHeight;
  } else {
    rectangleX = coordsFromBottomLeft.x;
    rectangleY = coordsFromBottomLeft.y;
  }
  return {
    rectangleX: rectangleX + cropBoxCoordinates.x,
    rectangleY: rectangleY + cropBoxCoordinates.y,
  };
};

const TEXT_SIZE = 14;
const PADDING = 3;

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
  serviceStampText = `SERVED ${applicationContext
    .getUtilities()
    .formatNow('MM/DD/YY')}`,
}) => {
  const {
    degrees,
    PDFDocument,
    rgb,
    StandardFonts,
  } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  const timesRomanBoldFont = pdfDoc.embedStandardFont(
    StandardFonts.TimesRomanBold,
  );

  const serviceStampWidth = timesRomanBoldFont.widthOfTextAtSize(
    serviceStampText,
    TEXT_SIZE,
  );
  const textHeight = timesRomanBoldFont.sizeAtHeight(TEXT_SIZE);
  const boxWidth = serviceStampWidth + PADDING * 2;
  const boxHeight = textHeight + PADDING * 2;

  const rotationAngle = page.getRotation().angle;
  const rotateStampDegrees = degrees(rotationAngle || 0);

  const { pageHeight, pageWidth, x, y } = getCropBoxCoordinates(page);

  const { rectangleX, rectangleY } = computeCoordinates({
    boxHeight,
    boxWidth,
    cropBoxCoordinates: { x, y },
    pageHeight,
    pageRotation: rotationAngle,
    pageWidth,
  });

  page.drawRectangle({
    color: rgb(1, 1, 1),
    height: boxHeight,
    rotate: rotateStampDegrees,
    width: boxWidth,
    x: rectangleX,
    y: rectangleY + PADDING,
  });

  page.drawText(serviceStampText, {
    font: timesRomanBoldFont,
    rotate: rotateStampDegrees,
    size: TEXT_SIZE,
    x: rectangleX + PADDING,
    y: rectangleY + PADDING * 2,
  });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });

  return pdfBytes;
};

exports.computeCoordinates = computeCoordinates;
