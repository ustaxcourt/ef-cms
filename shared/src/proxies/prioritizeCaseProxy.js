const { post } = require('./requests');

/**
 * prioritizeCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update
 * @param {object} providers.reason the reason the case was set as high priority
 * @returns {Promise<*>} the promise of the api call
 */
exports.prioritizeCaseInteractor = ({ applicationContext, caseId, reason }) => {
  return post({
    applicationContext,
    body: { reason },
    endpoint: `/case-meta/${caseId}/high-priority`,
  });
};
