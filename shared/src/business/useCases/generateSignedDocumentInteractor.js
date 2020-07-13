// TODO: refactor here

/**
 * @param {PDFPage} page the page to get dimensions for
 * @returns {Array} [width, height]
 */
exports.getPageDimensions = page => {
  const size = page.getSize();
  return [size.width, size.height];
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

  const [, pageHeight] = exports.getPageDimensions(page);

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

  page.drawRectangle({
    color: rgb(1, 1, 1),
    height: boxHeight,
    width: boxWidth,
    x: posX,
    y: pageHeight - posY - boxHeight,
  });
  page.drawText(signatureName, {
    font: helveticaBoldFont,
    size: textSize,
    x: posX + (boxWidth - nameTextWidth) / 2,
    y: pageHeight - posY + boxHeight / 2 - boxHeight,
  });
  page.drawText(signatureTitle, {
    font: helveticaBoldFont,
    size: textSize,
    x: posX + (boxWidth - titleTextWidth) / 2,
    y:
      pageHeight -
      posY +
      (boxHeight - textHeight * 2 - lineHeight) / 2 -
      boxHeight,
  });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });

  return pdfBytes;
};
