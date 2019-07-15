const { remove } = require('../requests');

/**
 * deleteCaseDeadlineInteractorProxy
 *
 * @param applicationContext
 * @param deleteCaseDeadline
 * @returns {Promise<*>}
 */
exports.deleteCaseDeadlineInteractor = ({
  applicationContext,
  caseDeadlineId,
  caseId,
}) => {
  return remove({
    applicationContext,
    endpoint: `/cases/${caseId}/case-deadline/${caseDeadlineId}`,
  });
};
