const { degrees } = require('pdf-lib');

/**
 * @param {PDFPage} page the page to get dimensions for
 * @returns {Array} [width, height]
 */
exports.getPageDimensions = page => {
  const size = page.getSize();
  return [size.width, size.height];
};

const translateXAndY = ({ height, rotation, width, x, y }) => {
  const Ox = width / 2;
  const Oy = height / 2;
  const newX = x - Ox + Ox * Math.cos(rotation) - Oy * Math.sin(rotation);
  const newY = y - Oy + Ox * Math.sin(rotation) + Oy * Math.cos(rotation);
  // if (rotation === 0) {
  //   return { x: newX, y: newY };
  // } else if (rotation === 270) {
  //   return { x: newY, y: newX };
  // }
  return { x: newX, y: newY };
};

exports.translateXAndY = translateXAndY;

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
    PDFDocument,
    rgb,
    StandardFonts,
  } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();
  const page = pages[pageIndex];

  const [pageWidth, pageHeight] = exports.getPageDimensions(page);

  const { signatureName, signatureTitle } = sigTextData;

  const helveticaBoldFont = pdfDoc.embedStandardFont(
    StandardFonts.HelveticaBold,
  );

  const textSize = 16 * scale;
  const padding = 20 * scale;
  const nameTextWidth = helveticaBoldFont.widthOfTextAtSize(
    signatureName,
    textSize,
  );
  const titleTextWidth = helveticaBoldFont.widthOfTextAtSize(
    signatureTitle,
    textSize,
  );
  const textHeight = helveticaBoldFont.sizeAtHeight(textSize);
  const lineHeight = textHeight / 10;
  const boxWidth = Math.max(nameTextWidth, titleTextWidth) + padding * 2;
  const boxHeight = textHeight * 2 + padding * 2;

  const rotationAngle = page.getRotation().angle;
  const shouldRotateSignature = rotationAngle !== 0;
  const rotateSignatureDegrees = degrees(rotationAngle);

  let pageRotation = page.getRotation().angle;
  let rotationRads = (pageRotation * Math.PI) / 180;

  let coordsFromBottomLeft = {
    x: posX / scale,
  };
  if (pageRotation === 90 || pageRotation === 270) {
    coordsFromBottomLeft.y = pageWidth - (posY + boxHeight) / scale;
  } else {
    coordsFromBottomLeft.y = pageHeight - (posY + boxHeight) / scale;
  }

  let drawX, drawY, sigTitleX, sigTitleY, sigNameX, sigNameY;
  if (pageRotation === 90) {
    drawX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads) +
      pageWidth;
    drawY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads);
    sigNameX = pageHeight - posY;
    sigNameY = pageHeight - posY + boxHeight / 2;
    sigTitleX = pageWidth - posY;
    sigTitleY = pageHeight - posX;
  } else if (pageRotation === 180) {
    drawX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads) +
      pageWidth;
    drawY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads) +
      pageHeight;
  } else if (pageRotation === 270) {
    drawX =
      coordsFromBottomLeft.x * Math.cos(rotationRads) -
      coordsFromBottomLeft.y * Math.sin(rotationRads);
    drawY =
      coordsFromBottomLeft.x * Math.sin(rotationRads) +
      coordsFromBottomLeft.y * Math.cos(rotationRads) +
      pageHeight;
    sigNameX = pageWidth - posY - textHeight * 2;
    sigNameY = pageHeight - posX - textHeight;
    sigTitleX = pageWidth - posY - textHeight * 3;
    sigTitleY = pageHeight - posX - textHeight * 4;
  } else {
    drawX = coordsFromBottomLeft.x;
    drawY = coordsFromBottomLeft.y;
    sigNameX = posX + (boxWidth - nameTextWidth) / 2;
    sigNameY = pageHeight - posY + boxHeight / 2 - boxHeight;
    sigTitleX = posX + (boxWidth - titleTextWidth) / 2;
    sigTitleY =
      pageHeight -
      posY +
      (boxHeight - textHeight * 2 - lineHeight) / 2 -
      boxHeight;
  }

  page.drawRectangle({
    color: rgb(0, 0, 1),
    height: boxHeight,
    rotate: shouldRotateSignature ? rotateSignatureDegrees : degrees(0),
    width: boxWidth,
    x: drawX,
    y: drawY,
  });
  page.drawText(signatureName, {
    font: helveticaBoldFont,
    rotate: shouldRotateSignature ? rotateSignatureDegrees : degrees(0),
    size: textSize,
    x: sigNameX,
    y: sigNameY,
  });
  // page.drawText(signatureTitle, {
  //   font: helveticaBoldFont,
  //   rotate: shouldRotateSignature ? rotateSignatureDegrees : degrees(0),
  //   size: textSize,
  //   x: sigTitleX,
  //   y: sigTitleY,
  // });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });

  return pdfBytes;
};
