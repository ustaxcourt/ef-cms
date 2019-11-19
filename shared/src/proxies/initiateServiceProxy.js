const { post } = require('./requests');

/**
 * initiateServiceInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @param {object} providers.documentId the id of the document
 * @returns {Promise<*>} the promise of the api call
 */
exports.initiateServiceInteractor = ({
  applicationContext,
  caseId,
  documentId,
}) => {
  return post({
    applicationContext,
    body: {
      caseId,
    },
    endpoint: `/documents/${documentId}/serve-court-issued`,
  });
};
