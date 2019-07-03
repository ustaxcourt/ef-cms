const pdfjsLib = require('pdfjs-dist');

/**
 * loadPDFForSigningInteractor
 *
 * @param pdf
 * @returns {Object}
 */

exports.loadPDFForSigning = async ({ applicationContext, documentId }) => {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    let pdfData = await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      documentId,
    });

    // There is a discrepency in how Node handles this response
    // (in the case of testing) vs how it's returned when run from
    // a browser. Additional changes in getDocument.js were added
    // to ensure something actually gets returned
    let arrayBuffer = pdfData;
    if (pdfData instanceof Blob) {
      arrayBuffer = await new Response(pdfData).arrayBuffer();
    }

    return await pdfjsLib.getDocument(arrayBuffer).promise;
  } catch (err) {
    throw new Error('error loading PDF');
  }
};
