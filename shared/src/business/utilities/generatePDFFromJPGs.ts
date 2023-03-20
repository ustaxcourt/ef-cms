/**
 * takes an array of JPG images (each a byte array) and combines
 * them into one PDF file
 *
 * @param {object} applicationContext the application context
 * @param {Array} imgData array of byte arrays
 * @returns {Uint8Array} byte array of PDF
 */

exports.generatePDFFromJPGs = async (applicationContext, { imgData }) => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.create();
  const addImageToPage = async img => {
    const imgRef = await pdfDoc.embedJpg(img);
    const page = pdfDoc.addPage([imgRef.width, imgRef.height]);
    page.drawImage(imgRef, {
      height: imgRef.height,
      width: imgRef.width,
      x: 0,
      y: 0,
    });
  };

  for (const image of imgData) {
    await addImageToPage(image);
  }

  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
};
