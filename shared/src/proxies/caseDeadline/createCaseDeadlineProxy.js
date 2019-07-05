const { post } = require('../requests');

/**
 * createCaseDeadlineInteractorProxy
 *
 * @param applicationContext
 * @param caseDeadline
 * @returns {Promise<*>}
 */
exports.createCaseDeadlineInteractor = ({
  applicationContext,
  caseDeadline,
}) => {
  return post({
    applicationContext,
    body: { caseDeadline },
    endpoint: `/cases/${caseDeadline.caseId}/case-deadline`,
  });
};
