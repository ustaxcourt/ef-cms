const {
  drawImage,
  drawRectangle,
  drawText,
  PDFDocumentFactory,
  PDFDocumentWriter,
} = require('pdf-lib');

/**
 * @param {PDFPage} page
 * @returns {Array}
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
 * @param pdfData // Uint8Array containing the pdf data to modify
 * @param pageIndex // Zero based index of the page to get the signature
 * @param posX // x coordinate where the image should be placed relative to the document
 * @param posY // y coordinate where the image should be placed relative to the document
 * @param scale // Scale of the img to be placed
 * @param sigImgData // Array of Uint8Array containing signature img data
 * @returns {ByteArray}
 */
exports.generateSignedDocument = async ({
  pageIndex,
  pdfData,
  posX,
  posY,
  scale = 1,
  sigImgData,
  sigTextData,
}) => {
  const pdfDoc = PDFDocumentFactory.load(pdfData);
  const pages = pdfDoc.getPages();
  const page = pages[pageIndex];

  let pageContentStream;

  const [, pageHeight] = exports.getPageDimensions(page);

  if (sigImgData) {
    const [imgRef, imgDim] = pdfDoc.embedPNG(sigImgData);
    page.addImageObject('imgObj', imgRef);

    pageContentStream = pdfDoc.createContentStream(
      drawImage('imgObj', {
        height: imgDim.height * scale,
        width: imgDim.width * scale,
        x: posX,
        y: pageHeight - posY,
      }),
    );
  } else if (sigTextData) {
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
      drawText(helveticaFont.encodeText(signatureName), {
        font: 'Helvetica-Bold',
        size: textSize,
        x: posX + (boxWidth - nameTextWidth) / 2,
        y: pageHeight - posY + boxHeight / 2,
      }),
      drawText(helveticaFont.encodeText(signatureTitle), {
        font: 'Helvetica-Bold',
        size: textSize,
        x: posX + (boxWidth - titleTextWidth) / 2,
        y: pageHeight - posY + (boxHeight - textHeight * 2 - lineHeight) / 2,
      }),
      drawRectangle({
        borderColorRgb: [0, 0, 0],
        borderWidth: 0.5,
        height: boxHeight,
        width: boxWidth,
        x: posX,
        y: pageHeight - posY,
      }),
    );
  }

  page.addContentStreams(pdfDoc.register(pageContentStream));

  const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc, {
    useObjectStreams: false,
  });

  return pdfBytes;
};
