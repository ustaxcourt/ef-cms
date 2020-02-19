const { put } = require('./requests');

/**
 * sealCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @returns {Promise<object>} the updated case data
 */
exports.sealCaseInteractor = ({ applicationContext, caseId }) => {
  return put({
    applicationContext,
    endpoint: `/case-meta/${caseId}/seal`,
  });
};
