const { post } = require('../requests');

/**
 * validatePdfInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.documentId the id of the document to validate
 * @returns {Promise<*>} the promise of the api call
 */
exports.validatePdfInteractor = ({ applicationContext, documentId }) => {
  return post({
    applicationContext,
    endpoint: `/documents/${documentId}/validate`,
  });
};
