const { post } = require('../requests');

/**
 * validatePdf
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.validatePdf = ({ applicationContext, documentId }) => {
  return post({
    applicationContext,
    endpoint: `/documents/${documentId}/validate`,
  });
};
