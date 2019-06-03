const { post } = require('../requests');

/**
 * createCoverSheet
 *
 * @param documentId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.virusScanPdfProxy = ({ documentId, applicationContext }) => {
  return post({
    applicationContext,
    endpoint: `/documents/${documentId}/virus-scan`,
  });
};
