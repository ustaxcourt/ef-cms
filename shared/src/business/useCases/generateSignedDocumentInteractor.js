const TEXT_SIZE = 15;
const PADDING = 13;

const computeCoordinates = ({
  applicationContext,
  boxHeight,
  boxWidth,
  cropBox,
  lineHeight,
  nameTextWidth,
  pageRotation,
  posX,
  posY,
  scale,
  textHeight,
  titleTextWidth,
}) => {
  const bottomLeftBoxCoordinates = {
    x: posX / scale,
  };
  if (pageRotation === 90 || pageRotation === 270) {
    bottomLeftBoxCoordinates.y = cropBox.pageWidth - (posY + boxHeight) / scale;
  } else {
    bottomLeftBoxCoordinates.y =
      cropBox.pageHeight - (posY + boxHeight) / scale;
  }

  const boxCoordinates = applicationContext
    .getUtilities()
    .getStampBoxCoordinates({
      bottomLeftBoxCoordinates,
      cropBox: { x: cropBox.x, y: cropBox.y },
      pageHeight: cropBox.pageHeight,
      pageRotation,
      pageWidth: cropBox.pageWidth,
    });

  let sigTitleX, sigTitleY, sigNameX, sigNameY;
  if (pageRotation === 90) {
    sigNameX = posY + textHeight * 2;
    sigNameY = posX + textHeight;

    sigTitleX = posY + textHeight * 3;
    sigTitleY = posX + textHeight * 4;
  } else if (pageRotation === 180) {
    sigNameX = cropBox.pageWidth - posX - (boxWidth - nameTextWidth) / 2;
    sigNameY = posY - boxHeight / 2 + boxHeight;

    sigTitleX = cropBox.pageWidth - posX - (boxWidth - titleTextWidth) / 2;
    sigTitleY =
      posY - (boxHeight - textHeight * 2 - lineHeight) / 2 + boxHeight;
  } else if (pageRotation === 270) {
    sigNameX = cropBox.pageWidth - posY - textHeight * 2;
    sigNameY = cropBox.pageHeight - posX - textHeight;

    sigTitleX = cropBox.pageWidth - posY - textHeight * 3;
    sigTitleY = cropBox.pageHeight - posX - textHeight * 4;
  } else {
    sigNameX = posX + (boxWidth - nameTextWidth) / 2;
    sigNameY = cropBox.pageHeight - posY + boxHeight / 2 - boxHeight;

    sigTitleX = posX + (boxWidth - titleTextWidth) / 2;
    sigTitleY =
      cropBox.pageHeight -
      posY +
      (boxHeight - textHeight * 2 - lineHeight) / 2 -
      boxHeight;
  }
  return {
    rectangleX: boxCoordinates.x,
    rectangleY: boxCoordinates.y,
    sigNameX: sigNameX + cropBox.x,
    sigNameY: sigNameY + cropBox.y,
    sigTitleX: sigTitleX + cropBox.x,
    sigTitleY: sigTitleY + cropBox.y,
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
    applicationContext,
    boxHeight,
    boxWidth,
    cropBox: applicationContext.getUtilities().getCropBox(pageToApplyStampTo),
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
  TEXT_SIZE,
  computeCoordinates,
  generateSignedDocumentInteractor,
};
