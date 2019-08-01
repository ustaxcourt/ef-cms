const { post } = require('../requests');

/**
 * associateRespondentWithCaseInteractorProxy
 *
 * @param applicationContext
 * @param caseId
 * @param userId
 * @returns {Promise<*>}
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
