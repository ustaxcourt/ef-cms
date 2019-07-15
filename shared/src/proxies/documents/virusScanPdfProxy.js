const { post } = require('../requests');

/**
 * virusScanPdfInteractor
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.virusScanPdfInteractor = ({ applicationContext, documentId }) => {
  return post({
    applicationContext,
    endpoint: `/api/documents/${documentId}/virus-scan`,
  });
};
