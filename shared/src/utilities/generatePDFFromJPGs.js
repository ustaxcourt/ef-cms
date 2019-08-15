const { drawImage, PDFDocument } = require('pdf-lib');

/**
 * takes an array of JPG images (each a bytearray) and combines
 * them into one PDF file
 *
 * @param {Array} imgData array of bytearrays
 * @returns {Uint8Array} bytearray of PDF
 */

exports.generatePDFFromJPGs = async imgData => {
  const pdfDoc = await PDFDocument.create();

  const addImageToPage = async img => {
    const [imgRef, imgDim] = await pdfDoc.embedJpg(img);
    const page = pdfDoc
      .addPage([imgDim.width, imgDim.height])
      .addImageObject('imgObj', imgRef);

    const pageContentStream = pdfDoc.createContentStream(
      drawImage('imgObj', {
        height: imgDim.height,
        width: imgDim.width,
        x: 0,
        y: 0,
      }),
    );
    page.addContentStreams(pdfDoc.register(pageContentStream));
    pdfDoc.addPage(page);
  };

  imgData.map(data => {
    addImageToPage(data);
  });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: false,
  });

  return pdfBytes;
};
