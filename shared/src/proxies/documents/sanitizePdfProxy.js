const { post } = require('../requests');

/**
 * sanitizePdfInteractor
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.sanitizePdfInteractor = ({ applicationContext, documentId }) => {
  return post({
    applicationContext,
    endpoint: `/api/documents/${documentId}/sanitize`,
  });
};
