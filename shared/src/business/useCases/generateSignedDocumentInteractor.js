const { drawRectangle, drawText, PDFDocument } = require('pdf-lib');

/**
 * @param {PDFPage} page the page to get dimensions for
 * @returns {Array} [width, height]
 */
exports.getPageDimensions = page => {
  let mediaBox;

  const hasMediaBox = !!page.getMaybe('MediaBox');
  if (hasMediaBox) {
    mediaBox = page.index.lookup(page.get('MediaBox'));
  }

  page.Parent.ascend(parent => {
    const parentHasMediaBox = !!parent.getMaybe('MediaBox');
    if (!mediaBox && parentHasMediaBox) {
      mediaBox = parent.index.lookup(parent.get('MediaBox'));
    }
  }, true);

  // This should never happen in valid PDF files
  if (!mediaBox) {
    throw new Error('Page Tree is missing MediaBox');
  }

  // x, y
  return [mediaBox.array[2].number, mediaBox.array[3].number];
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
  pageIndex,
  pdfData,
  posX,
  posY,
  scale = 1,
  sigTextData,
}) => {
  const pdfDoc = await PDFDocument.load(pdfData);
  const pages = pdfDoc.getPages();
  const page = pages[pageIndex];

  let pageContentStream;

  const [, pageHeight] = exports.getPageDimensions(page);

  const { signatureName, signatureTitle } = sigTextData;

  const [helveticaRef, helveticaFont] = pdfDoc.embedStandardFont(
    'Helvetica-Bold',
  );

  page.addFontDictionary('Helvetica-Bold', helveticaRef);

  const textSize = 16 * scale;
  const padding = 20 * scale;
  const nameTextWidth = helveticaFont.widthOfTextAtSize(
    signatureName,
    textSize,
  );
  const titleTextWidth = helveticaFont.widthOfTextAtSize(
    signatureTitle,
    textSize,
  );
  const textHeight = helveticaFont.heightOfFontAtSize(textSize);
  const lineHeight = textHeight / 10;
  const boxWidth = Math.max(nameTextWidth, titleTextWidth) + padding * 2;
  const boxHeight = textHeight * 2 + padding * 2;

  pageContentStream = pdfDoc.createContentStream(
    drawRectangle({
      colorRgb: [1, 1, 1],
      height: boxHeight,
      width: boxWidth,
      x: posX,
      y: pageHeight - posY - boxHeight,
    }),
    drawText(helveticaFont.encodeText(signatureName), {
      font: 'Helvetica-Bold',
      size: textSize,
      x: posX + (boxWidth - nameTextWidth) / 2,
      y: pageHeight - posY + boxHeight / 2 - boxHeight,
    }),
    drawText(helveticaFont.encodeText(signatureTitle), {
      font: 'Helvetica-Bold',
      size: textSize,
      x: posX + (boxWidth - titleTextWidth) / 2,
      y:
        pageHeight -
        posY +
        (boxHeight - textHeight * 2 - lineHeight) / 2 -
        boxHeight,
    }),
  );

  page.addContentStreams(pdfDoc.register(pageContentStream));

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });

  return pdfBytes;
};
