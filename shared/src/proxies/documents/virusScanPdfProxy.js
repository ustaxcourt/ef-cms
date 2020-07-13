const { post } = require('../requests');

/**
 * virusScanPdfInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.documentId the id of the document to virus scan
 * @returns {Promise<*>} the promise of the api call
 */
exports.virusScanPdfInteractor = ({ applicationContext, documentId }) => {
  return post({
    applicationContext,
    endpoint: `/clamav/documents/${documentId}/virus-scan`,
  });
};
