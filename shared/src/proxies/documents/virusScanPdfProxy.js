const { post } = require('../requests');

/**
 * virusScanPdf
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.virusScanPdf = ({ documentId, applicationContext }) => {
  return post({
    applicationContext,
    endpoint: `/documents/${documentId}/virus-scan`,
  });
};
