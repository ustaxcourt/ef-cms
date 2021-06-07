const {
  getCropBoxCoordinates,
} = require('../generateSignedDocumentInteractor');

const computeCoordinates = ({
  boxHeight,
  boxWidth,
  pageRotation,
  pageToApplyStampTo,
}) => {
  const { pageHeight, pageWidth, x, y } = getCropBoxCoordinates(
    pageToApplyStampTo,
  );

  const rotationRads = (pageRotation * Math.PI) / 180;
  const coordsFromBottomLeft = {
    x: pageWidth / 2 - boxWidth / 2,
    y: y + boxHeight + PADDING * 2,
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
    rectangleX: rectangleX + x,
    rectangleY: rectangleY + y,
  };
};

const TEXT_SIZE = 14;
const PADDING = 3;

const getBoxWidth = ({ font, text }) => {
  const serviceStampWidth = font.widthOfTextAtSize(text, TEXT_SIZE);
  return serviceStampWidth + PADDING * 2;
};

const getBoxHeight = ({ font }) => {
  const textHeight = font.sizeAtHeight(TEXT_SIZE);
  return textHeight + PADDING * 2;
};

const setupPdfDocument = async ({ applicationContext, pdfData }) => {
  const { PDFDocument, StandardFonts } = await applicationContext.getPdfLib();
  const pdfDoc = await PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();

  const textFont = pdfDoc.embedStandardFont(StandardFonts.TimesRomanBold);

  return { pageToApplyStampTo: pages[0], pdfDoc, textFont };
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
  serviceStampText = `SERVED ${applicationContext
    .getUtilities()
    .formatNow('MM/DD/YY')}`,
}) => {
  const { degrees, rgb } = await applicationContext.getPdfLib();

  const { pageToApplyStampTo, pdfDoc, textFont } = await setupPdfDocument({
    applicationContext,
    pdfData,
  });

  const boxWidth = getBoxWidth({
    font: textFont,
    text: serviceStampText,
  });
  const boxHeight = getBoxHeight({ font: textFont });

  const rotationAngle = pageToApplyStampTo.getRotation().angle;
  const rotateStampDegrees = degrees(rotationAngle || 0);

  const { rectangleX, rectangleY } = computeCoordinates({
    boxHeight,
    boxWidth,
    pageRotation: rotationAngle,
    pageToApplyStampTo,
  });

  pageToApplyStampTo.drawRectangle({
    color: rgb(1, 1, 1),
    height: boxHeight,
    rotate: rotateStampDegrees,
    width: boxWidth,
    x: rectangleX,
    y: rectangleY + PADDING,
  });

  pageToApplyStampTo.drawText(serviceStampText, {
    font: textFont,
    rotate: rotateStampDegrees,
    size: TEXT_SIZE,
    x: rectangleX + PADDING,
    y: rectangleY + PADDING * 2,
  });

  return await pdfDoc.save({
    useObjectStreams: false,
  });
};

exports.computeCoordinates = computeCoordinates;
