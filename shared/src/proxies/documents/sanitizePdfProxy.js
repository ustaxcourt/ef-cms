const { post } = require('../requests');

/**
 * sanitizePdf
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.sanitizePdf = ({ documentId, applicationContext }) => {
  return post({
    applicationContext,
    endpoint: `/documents/${documentId}/sanitize`,
  });
};
