const { PDFDocument } = require('pdf-lib');

/**
 * loadPDFForSigningInteractor
 *
 * @param pdf
 * @returns {object}
 */

exports.loadPDFForSigningInteractor = async ({
  applicationContext,
  documentId,
  removeCover = false,
}) => {
  try {
    const pdfjsLib = await applicationContext.getPdfJs();
    let pdfData = await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      documentId,
    });

    let formattedArrayBuffer;
    const arrayBuffer = await new Response(pdfData).arrayBuffer();

    if (removeCover) {
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      pdfDoc.removePage(0);
      formattedArrayBuffer = await pdfDoc.save({
        useObjectStreams: false,
      });
    } else {
      formattedArrayBuffer = arrayBuffer;
    }

    return await pdfjsLib.getDocument(formattedArrayBuffer).promise;
  } catch (err) {
    throw new Error('error loading PDF');
  }
};
