const TEXT_SIZE = 14;
const PADDING = 3;

const computeCoordinates = ({
  applicationContext,
  boxHeight,
  boxWidth,
  pageRotation,
  pageToApplyStampTo,
}) => {
  const {
    pageHeight,
    pageWidth,
    x,
    y,
  } = applicationContext.getUtilities().getCropBox(pageToApplyStampTo);

  const bottomLeftBoxCoordinates = {
    x: pageWidth / 2 - boxWidth / 2,
    y: y + boxHeight + PADDING * 2,
  };

  const boxCoordinates = applicationContext
    .getUtilities()
    .getStampBoxCoordinates({
      bottomLeftBoxCoordinates,
      cropBox: { x, y },
      pageHeight,
      pageRotation,
      pageWidth,
    });

  return boxCoordinates;
};

const getBoxWidth = ({ font, text }) => {
  const serviceStampWidth = font.widthOfTextAtSize(text, TEXT_SIZE);
  return serviceStampWidth + PADDING * 2;
};

const getBoxHeight = ({ font }) => {
  const textHeight = font.sizeAtHeight(TEXT_SIZE);
  return textHeight + PADDING * 2;
};

/**
 * addServedStampToDocument
 *
 * @param {object} providers the providers object
 * @param {object} providers.pdfData the original document pdf data
 * @param {string} providers.serviceStampText the service stamp text to add to the document
 * @returns {object} the new pdf with the stamp at the bottom center of the document
 */
const addServedStampToDocument = async ({
  applicationContext,
  pdfData,
  serviceStampText = `SERVED ${applicationContext
    .getUtilities()
    .formatNow('MM/DD/YY')}`,
}) => {
  const { degrees, rgb } = await applicationContext.getPdfLib();

  const {
    pdfDoc,
    textFont,
  } = await applicationContext.getUtilities().setupPdfDocument({
    applicationContext,
    pdfData,
  });

  const pageToApplyStampTo = pdfDoc.getPages()[0];

  const boxWidth = getBoxWidth({
    font: textFont,
    text: serviceStampText,
  });

  const boxHeight = getBoxHeight({ font: textFont });

  const rotationAngle = pageToApplyStampTo.getRotation().angle;
  const rotateStampDegrees = degrees(rotationAngle || 0);

  const boxCoordinates = computeCoordinates({
    applicationContext,
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
    x: boxCoordinates.x,
    y: boxCoordinates.y + PADDING,
  });

  pageToApplyStampTo.drawText(serviceStampText, {
    font: textFont,
    rotate: rotateStampDegrees,
    size: TEXT_SIZE,
    x: boxCoordinates.x + PADDING,
    y: boxCoordinates.y + PADDING * 2,
  });

  return await pdfDoc.save({
    useObjectStreams: false,
  });
};

module.exports = { PADDING, addServedStampToDocument, computeCoordinates };
