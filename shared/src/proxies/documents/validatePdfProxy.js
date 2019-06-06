const { post } = require('../requests');

/**
 * validatePdf
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.virusPdf = ({ documentId, applicationContext }) => {
  return post({
    applicationContext,
    endpoint: `/documents/${documentId}/validate`,
  });
};
