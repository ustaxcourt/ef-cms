const { put } = require('./requests');

/**
 * updateCaseInteractor
 *
 * @param applicationContext
 * @param caseToUpdate
 * @param userId
 * @returns {Promise<*>}
 */
exports.updateCaseInteractor = ({ applicationContext, caseToUpdate }) => {
  return put({
    applicationContext,
    body: caseToUpdate,
    endpoint: `/cases/${caseToUpdate.caseId}`,
  });
};
