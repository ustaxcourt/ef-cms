const { put } = require('./requests');

/**
 * updateCase
 *
 * @param applicationContext
 * @param caseToUpdate
 * @param userId
 * @returns {Promise<*>}
 */
exports.updateCase = ({ applicationContext, caseToUpdate }) => {
  return put({
    applicationContext,
    body: caseToUpdate,
    endpoint: `/cases/${caseToUpdate.caseId}`,
  });
};
