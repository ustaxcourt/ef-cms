const { post } = require('../requests');

/**
 * serveCaseToIrsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId caseId for serving a case
 * @returns {Promise<*>} the promise of the api call
 */
exports.serveCaseToIrsInteractor = ({ applicationContext, caseId }) => {
  return post({
    applicationContext,
    endpoint: `/cases/${caseId}/serve-to-irs`,
  });
};
