const { post } = require('../requests');

/**
 * virusScanPdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key of the document to virus scan
 * @returns {Promise<*>} the promise of the api call
 */
exports.virusScanPdfInteractor = (applicationContext, { key }) => {
  return post({
    applicationContext,
    endpoint: `/clamav/documents/${key}/virus-scan`,
  });
};
