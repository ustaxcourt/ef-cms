/**
 * loadPDFForSigningInteractor
 *
 * @param {object} obj the params object
 * @param {string} obj.applicationContext the application context
 * @param {string} obj.docketNumber the docketNumber
 * @param {string} obj.documentId the document id
 * @param {boolean} obj.removeCover if saving should remove the cover sheet
 * @returns {Promise<object>} the document data
 */
exports.loadPDFForSigningInteractor = async ({
  applicationContext,
  docketNumber,
  documentId,
  removeCover = false,
}) => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  try {
    const pdfjsLib = await applicationContext.getPdfJs();
    let pdfData = await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      docketNumber,
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
