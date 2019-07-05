const { get } = require('../requests');

/**
 * getCaseDeadlinesForCaseInteractorProxy
 *
 * @param applicationContext
 * @param getCaseDeadlinesForCase
 * @returns {Promise<*>}
 */
exports.getCaseDeadlinesForCaseInteractor = ({
  applicationContext,
  caseId,
}) => {
  return get({
    applicationContext,
    endpoint: `/cases/${caseId}/case-deadline`,
  });
};
