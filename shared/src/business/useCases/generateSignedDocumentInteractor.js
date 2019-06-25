const { drawImage, PDFDocumentFactory, PDFDocumentWriter } = require('pdf-lib');

/**
 * generateSignedDocumentInteractor
 *
 * @param pdfData // Uint8Array containing the pdf data to modify
 * @param pageIndex // Zero based index of the page to get the signature
 * @param posX // x coordinate where the image should be placed relative to the document
 * @param posY // y coordinate where the image should be placed relative to the document
 * @param scale // Scale of the img to be placed
 * @param sigImgData // Array of Uint8Array containing signature img data
 */

exports.generateSignedDocumentInteractor = async ({
  pageIndex,
  pdfData,
  posX,
  posY,
  scale = 1,
  sigImgData,
}) => {
  const pdfDoc = PDFDocumentFactory.load(pdfData);
  const [imgRef, imgDim] = pdfDoc.embedPNG(sigImgData);
  const pages = pdfDoc.getPages();
  const page = pages[pageIndex].addImageObject('imgObj', imgRef);

  const pageContentStream = pdfDoc.createContentStream(
    drawImage('imgObj', {
      height: imgDim.height * scale,
      width: imgDim.width * scale,
      x: posX,
      y: posY,
    }),
  );

  page.addContentStreams(pdfDoc.register(pageContentStream));

  const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc, {
    useObjectStreams: false,
  });

  return pdfBytes;
};
