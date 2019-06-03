const { get } = require('../requests');

/**
 * virusScanPdf
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.virusScanPdf = ({ documentId, applicationContext }) => {
  return get({
    applicationContext,
    endpoint: `/documents/${documentId}/virus-scan`,
  });
};
