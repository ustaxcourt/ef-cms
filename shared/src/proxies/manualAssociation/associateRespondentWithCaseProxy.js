const { post } = require('../requests');

/**
 * associateRespondentWithCaseInteractorProxy
 *
 * @param {object} params the params object
 * @param {object} params.applicationContext the application context
 * @param {string} params.caseId the case id
 * @param {string} params.userId the user id
 * @returns {Promise<*>} the promise of the api call
 */
exports.associateRespondentWithCaseInteractor = ({
  applicationContext,
  caseId,
  userId,
}) => {
  return post({
    applicationContext,
    body: { caseId, userId },
    endpoint: `/cases/${caseId}/associate-respondent`,
  });
};
