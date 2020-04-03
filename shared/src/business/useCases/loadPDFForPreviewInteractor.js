/**
 * loadPDFForPreviewInteractor
 *
 * @param obj
 * @param {string} obj.applicationContext the application context
 * @param {string} obj.caseId the caseId
 * @param {string} obj.documentId the document id
 * @returns {Promise<object>}
 */

exports.loadPDFForPreviewInteractor = async ({
  applicationContext,
  caseId,
  documentId,
}) => {
  try {
    return await applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      caseId,
      documentId,
    });
  } catch (err) {
    throw new Error('error loading PDF');
  }
};
