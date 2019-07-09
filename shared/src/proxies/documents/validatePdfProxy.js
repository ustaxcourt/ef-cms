const { post } = require('../requests');

/**
 * validatePdfInteractor
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.validatePdfInteractor = ({ applicationContext, documentId }) => {
  return post({
    applicationContext,
    endpoint: `/api/documents/${documentId}/validate`,
  });
};
