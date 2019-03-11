const { get } = require('./requests');

/**
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDownloadPolicyUrl = ({ documentId, applicationContext }) => {
  return get({
    applicationContext,
    endpoint: `/documents/${documentId}/downloadPolicyUrl`,
  });
};
