const { post } = require('../requests');

/**
 * associateRespondentWithCaseInteractorProxy
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.caseId the case id
 * @param {string} params.serviceIndicator the type of service the respondent should receive
 * @param {string} params.userId the user id
 * @returns {Promise<*>} the promise of the api call
 */
exports.associateRespondentWithCaseInteractor = ({
  applicationContext,
  caseId,
  serviceIndicator,
  userId,
}) => {
  return post({
    applicationContext,
    body: { caseId, serviceIndicator, userId },
    endpoint: `/case-parties/${caseId}/associate-respondent`,
  });
};
