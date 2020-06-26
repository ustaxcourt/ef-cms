/**
 * loadPDFForSigningInteractor
 *
 * @param obj
 * @param {string} obj.applicationContext the application context
 * @param {string} obj.caseId the caseId
 * @param {string} obj.documentId the document id
 * @param {boolean} obj.removeCover if saving should remove the cover sheet
 * @returns {object}
 */

exports.loadPDFForSigningInteractor = async ({
  applicationContext,
  caseId,
  documentId,
  removeCover = false,
}) => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  try {
    const pdfjsLib = await applicationContext.getPdfJs();
    let pdfData = await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      caseId,
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
