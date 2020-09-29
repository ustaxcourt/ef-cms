const { post } = require('../requests');

/**
 * validatePdfInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the document to validate
 * @returns {Promise<*>} the promise of the api call
 */
exports.validatePdfInteractor = ({ applicationContext, key }) => {
  return post({
    applicationContext,
    endpoint: `/documents/${key}/validate`,
  });
};
