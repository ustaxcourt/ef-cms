/**
 * @param {PDFPage} page the page to get dimensions for
 * @returns {Array} [width, height]
 */
exports.getPageDimensions = page => {
  const sizeCropBox = page.getCropBox();
  return [sizeCropBox.width, sizeCropBox.height];
};

exports.getCropBoxCoordinates = page => {
  const { x = 0, y = 0 } = page.getCropBox();
  return { x, y };
};

const computeCoordinates = ({
  boxHeight,
  boxWidth,
  cropBoxCoordinates,
  lineHeight,
  nameTextWidth,
  pageHeight,
  pageRotation,
  pageWidth,
  posX,
  posY,
  scale,
  textHeight,
  titleTextWidth,
}) => {
  let rotationRads = (pageRotation * Math.PI) / 180;
  let coordsFromBottomLeft = {
    x: posX / scale,
  };
  if (pageRotation === 90 || pageRotation === 270) {
    coordsFromBottomLeft.y = pageWidth - (posY + boxHeight) / scale;
  } else {
    coordsFromBottomLeft.y = pageHeight - (posY + boxHeight) / scale;
  }

  let rectangleX, rectangleY, sigTitleX, sigTitleY, sigNameX, sigNameY;

  if (pageRotation === 90) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads) +
      pageWidth;
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
      pageWidth;
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads) +
      pageHeight;

    sigNameX = pageWidth - posX - (boxWidth - nameTextWidth) / 2;
    sigNameY = posY - boxHeight / 2 + boxHeight;

    sigTitleX = pageWidth - posX - (boxWidth - titleTextWidth) / 2;
    sigTitleY =
      posY - (boxHeight - textHeight * 2 - lineHeight) / 2 + boxHeight;
  } else if (pageRotation === 270) {
    rectangleX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads);
    rectangleY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads) +
      pageHeight;
    sigNameX = pageWidth - posY - textHeight * 2;
    sigNameY = pageHeight - posX - textHeight;
    sigTitleX = pageWidth - posY - textHeight * 3;
    sigTitleY = pageHeight - posX - textHeight * 4;
  } else {
    rectangleX = coordsFromBottomLeft.x;
    rectangleY = coordsFromBottomLeft.y;
    sigNameX = posX + (boxWidth - nameTextWidth) / 2;
    sigNameY = pageHeight - posY + boxHeight / 2 - boxHeight;

    sigTitleX = posX + (boxWidth - titleTextWidth) / 2;
    sigTitleY =
      pageHeight -
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

exports.computeCoordinates = computeCoordinates;

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
exports.generateSignedDocumentInteractor = async ({
  applicationContext,
  pageIndex,
  pdfData,
  posX,
  posY,
  scale = 1,
  sigTextData,
}) => {
  const {
    degrees,
    PDFDocument,
    rgb,
    StandardFonts,
  } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();
  const page = pages[pageIndex];

  const [pageWidth, pageHeight] = exports.getPageDimensions(page);

  const { signatureName, signatureTitle } = sigTextData;

  const timesRomanBoldFont = pdfDoc.embedStandardFont(
    StandardFonts.TimesRomanBold,
  );

  const textSize = 15 * scale;
  const padding = 13 * scale;
  const nameTextWidth = timesRomanBoldFont.widthOfTextAtSize(
    signatureName,
    textSize,
  );
  const titleTextWidth = timesRomanBoldFont.widthOfTextAtSize(
    signatureTitle,
    textSize,
  );
  const textHeight = timesRomanBoldFont.sizeAtHeight(textSize);
  const lineHeight = textHeight / 10;
  const boxWidth = Math.max(nameTextWidth, titleTextWidth) + padding * 2;
  const boxHeight = textHeight * 2 + padding * 2;

  const rotationAngle = page.getRotation().angle;
  const shouldRotateSignature = rotationAngle !== 0;
  const rotateSignatureDegrees = degrees(rotationAngle);

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
    cropBoxCoordinates: exports.getCropBoxCoordinates(page),
    lineHeight,
    nameTextWidth,
    pageHeight,
    pageRotation: rotationAngle,
    pageWidth,
    posX,
    posY,
    scale,
    textHeight,
    titleTextWidth,
  });

  const rotate = shouldRotateSignature ? rotateSignatureDegrees : degrees(0);

  page.drawRectangle({
    color: rgb(1, 1, 1),
    height: boxHeight,
    rotate,
    width: boxWidth,
    x: rectangleX,
    y: rectangleY,
  });
  page.drawText(signatureName, {
    font: timesRomanBoldFont,
    rotate,
    size: textSize,
    x: sigNameX,
    y: sigNameY,
  });
  page.drawText(signatureTitle, {
    font: timesRomanBoldFont,
    rotate,
    size: textSize,
    x: sigTitleX,
    y: sigTitleY,
  });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });

  return pdfBytes;
};
