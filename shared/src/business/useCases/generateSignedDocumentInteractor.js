const {
  drawImage,
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
  const page = pages[pageIndex - 1];

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
    const [timesRomanRef, timesRomanFont] = pdfDoc.embedStandardFont(
      'Times-Roman',
    );

    page.addFontDictionary('TimesRoman', timesRomanRef);

    pageContentStream = pdfDoc.createContentStream(
      drawText(timesRomanFont.encodeText(sigTextData), {
        font: 'TimesRoman',
        size: 15 * scale,
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
