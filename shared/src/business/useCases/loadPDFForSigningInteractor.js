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

    const arrayBuffer = await new Response(pdfData).arrayBuffer();
    return await pdfjsLib.getDocument(arrayBuffer).promise;
  } catch (err) {
    throw new Error('error loading PDF');
  }
};
