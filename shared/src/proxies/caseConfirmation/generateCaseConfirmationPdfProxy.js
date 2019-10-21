const { post } = require('../requests');

/**
 * generateCaseConfirmationPdfInteractorProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to add notes to
 * @returns {Promise<*>} the promise of the api call
 */
exports.generateCaseConfirmationPdfInteractor = ({
  applicationContext,
  caseId,
}) => {
  return post({
    applicationContext,
    endpoint: `/cases/${caseId}/confirmation`,
  });
};
