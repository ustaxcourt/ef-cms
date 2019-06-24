const { post } = require('../requests');

/**
 * sanitizePdf
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.sanitizePdf = ({ applicationContext, documentId }) => {
  return post({
    applicationContext,
    endpoint: `/documents/${documentId}/sanitize`,
  });
};
