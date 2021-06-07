const TEXT_SIZE = 15;
const PADDING = 13;

const computeCoordinates = ({
  boxHeight,
  boxWidth,
  cropBoxCoordinates,
  lineHeight,
  nameTextWidth,
  pageRotation,
  posX,
  posY,
  scale,
  textHeight,
  titleTextWidth,
}) => {
  const rotationRads = (pageRotation * Math.PI) / 180;
  let coordsFromBottomLeft = {
    x: posX / scale,
  };
  if (pageRotation === 90 || pageRotation === 270) {
    coordsFromBottomLeft.y =
      cropBoxCoordinates.pageWidth - (posY + boxHeight) / scale;
  } else {
    coordsFromBottomLeft.y =
      cropBoxCoordinates.pageHeight - (posY + boxHeight) / scale;
  }

  let rectangleX, rectangleY, sigTitleX, sigTitleY, sigNameX, sigNameY;

  if (pageRotation === 90) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads) +
      cropBoxCoordinates.pageWidth;
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads);
    sigNameX = posY + textHeight * 2;
    sigNameY = posX + textHeight;
    sigTitleX = posY + textHeight * 3;
    sigTitleY = posX + textHeight * 4;
  } else if (pageRotation === 180) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads) +
      cropBoxCoordinates.pageWidth;
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads) +
      cropBoxCoordinates.pageHeight;

    sigNameX =
      cropBoxCoordinates.pageWidth - posX - (boxWidth - nameTextWidth) / 2;
    sigNameY = posY - boxHeight / 2 + boxHeight;

    sigTitleX =
      cropBoxCoordinates.pageWidth - posX - (boxWidth - titleTextWidth) / 2;
    sigTitleY =
      posY - (boxHeight - textHeight * 2 - lineHeight) / 2 + boxHeight;
  } else if (pageRotation === 270) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads);
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads) +
      cropBoxCoordinates.pageHeight;
    sigNameX = cropBoxCoordinates.pageWidth - posY - textHeight * 2;
    sigNameY = cropBoxCoordinates.pageHeight - posX - textHeight;
    sigTitleX = cropBoxCoordinates.pageWidth - posY - textHeight * 3;
    sigTitleY = cropBoxCoordinates.pageHeight - posX - textHeight * 4;
  } else {
    rectangleX = coordsFromBottomLeft.x;
    rectangleY = coordsFromBottomLeft.y;
    sigNameX = posX + (boxWidth - nameTextWidth) / 2;
    sigNameY = cropBoxCoordinates.pageHeight - posY + boxHeight / 2 - boxHeight;

    sigTitleX = posX + (boxWidth - titleTextWidth) / 2;
    sigTitleY =
      cropBoxCoordinates.pageHeight -
      posY +
      (boxHeight - textHeight * 2 - lineHeight) / 2 -
      boxHeight;
  }
  return {
    rectangleX: rectangleX + cropBoxCoordinates.x,
    rectangleY: rectangleY + cropBoxCoordinates.y,
    sigNameX: sigNameX + cropBoxCoordinates.x,
    sigNameY: sigNameY + cropBoxCoordinates.y,
    sigTitleX: sigTitleX + cropBoxCoordinates.x,
    sigTitleY: sigTitleY + cropBoxCoordinates.y,
  };
};

/**
 * generateSignedDocumentInteractor
 *
 * @param {object} providers the providers object
 * @param {number} providers.pageIndex // Zero based index of the page to get the signature
 * @param {Uint8Array} providers.pdfData // Uint8Array containing the pdf data to modify
 * @param {number} providers.posX // x coordinate where the image should be placed relative to the document
 * @param {number} providers.posY // y coordinate where the image should be placed relative to the document
 * @param {number} providers.scale // Scale of the img to be placed
 * @param {object} providers.sigTextData // Signature text data including the name and title
 * @returns {ByteArray} PDF data after signature is added
 */
const generateSignedDocumentInteractor = async ({
  applicationContext,
  pageIndex,
  pdfData,
  posX,
  posY,
  scale = 1,
  sigTextData,
}) => {
  const { degrees, rgb } = await applicationContext.getPdfLib();

  const {
    pdfDoc,
    textFont,
  } = await applicationContext.getUtilities().setupPdfDocument({
    applicationContext,
    pdfData,
  });

  const pageToApplyStampTo = pdfDoc.getPages()[pageIndex];

  const { signatureName, signatureTitle } = sigTextData;

  const textSize = TEXT_SIZE * scale;
  const padding = PADDING * scale;

  const nameTextWidth = textFont.widthOfTextAtSize(signatureName, textSize);
  const titleTextWidth = textFont.widthOfTextAtSize(signatureTitle, textSize);
  const textHeight = textFont.sizeAtHeight(textSize);
  const lineHeight = textHeight / 10;
  const boxWidth = Math.max(nameTextWidth, titleTextWidth) + padding * 2;
  const boxHeight = textHeight * 2 + padding * 2;

  const rotationAngle = pageToApplyStampTo.getRotation().angle;
  const rotateSignatureDegrees = degrees(rotationAngle || 0);

  const {
    rectangleX,
    rectangleY,
    sigNameX,
    sigNameY,
    sigTitleX,
    sigTitleY,
  } = computeCoordinates({
    boxHeight,
    boxWidth,
    cropBoxCoordinates: applicationContext
      .getUtilities()
      .getCropBoxCoordinates(pageToApplyStampTo),
    lineHeight,
    nameTextWidth,
    pageRotation: rotationAngle,
    posX,
    posY,
    scale,
    textHeight,
    titleTextWidth,
  });

  pageToApplyStampTo.drawRectangle({
    color: rgb(1, 1, 1),
    height: boxHeight,
    rotate: rotateSignatureDegrees,
    width: boxWidth,
    x: rectangleX,
    y: rectangleY,
  });

  pageToApplyStampTo.drawText(signatureName, {
    font: textFont,
    rotate: rotateSignatureDegrees,
    size: textSize,
    x: sigNameX,
    y: sigNameY,
  });

  pageToApplyStampTo.drawText(signatureTitle, {
    font: textFont,
    rotate: rotateSignatureDegrees,
    size: textSize,
    x: sigTitleX,
    y: sigTitleY,
  });

  return await pdfDoc.save({
    useObjectStreams: false,
  });
};

module.exports = {
  computeCoordinates,
  generateSignedDocumentInteractor,
};
