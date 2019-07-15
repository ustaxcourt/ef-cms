const { get } = require('./requests');

/**
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDownloadPolicyUrl = ({ applicationContext, documentId }) => {
  return get({
    applicationContext,
    endpoint: `/api/documents/${documentId}/download-policy-url`,
  });
};
