const pdflib = require('pdf-lib');
const { PDFDocumentFactory, PDFDocumentWriter, drawImage } = pdflib;

/**
 * generatePDFFromPNGData
 *
 * @param imgData // Array of Uint8Array containing img data
 */

exports.generatePDFFromPNGData = imgData => {
  const dimensionsX = 2550;
  const dimensionsY = 3300;
  const dimensions = [dimensionsX, dimensionsY];

  const pdfDoc = PDFDocumentFactory.create();

  function addImageToPage(img) {
    const [imgRef] = pdfDoc.embedPNG(img);
    const page = pdfDoc.createPage(dimensions).addImageObject('imgObj', imgRef);

    const pageContentStream = pdfDoc.createContentStream(
      drawImage('imgObj', {
        height: dimensionsY,
        width: dimensionsX,
        x: 0,
        y: 0,
      }),
    );
    page.addContentStreams(pdfDoc.register(pageContentStream));
    pdfDoc.addPage(page);
  }

  imgData.map(data => {
    addImageToPage(data);
  });

  const pdfBytes = PDFDocumentWriter.saveToBytes(pdfDoc, {
    useObjectStreams: false,
  });

  return pdfBytes;
};
