const { put } = require('../requests');

/**
 * updateCaseDeadlineInteractorProxy
 *
 * @param applicationContext
 * @param caseDeadline
 * @returns {Promise<*>}
 */
exports.updateCaseDeadlineInteractor = ({
  applicationContext,
  caseDeadline,
}) => {
  return put({
    applicationContext,
    body: { caseDeadline },
    endpoint: `/cases/${caseDeadline.caseId}/case-deadline/${caseDeadline.caseDeadlineId}`,
  });
};
