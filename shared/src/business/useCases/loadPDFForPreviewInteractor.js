/**
 * loadPDFForPreviewInteractor
 *
 * @param {object} obj the params object
 * @param {string} obj.applicationContext the application context
 * @param {string} obj.docketNumber the docket number of the case
 * @param {string} obj.documentId the document id
 * @returns {Promise<object>} the document data
 */
exports.loadPDFForPreviewInteractor = async ({
  applicationContext,
  docketNumber,
  documentId,
}) => {
  try {
    return await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      docketNumber,
      documentId,
    });
  } catch (err) {
    throw new Error('error loading PDF');
  }
};
