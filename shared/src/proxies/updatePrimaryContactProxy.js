const { put } = require('./requests');

/**
 * updatePrimaryContactInteractor
 *
 * @param applicationContext
 * @param caseId
 * @param userToken
 * @returns {Promise<*>}
 */
exports.updatePrimaryContactInteractor = ({
  applicationContext,
  caseToUpdate,
}) => {
  return put({
    applicationContext,
    body: caseToUpdate,
    endpoint: `/cases/${caseToUpdate.caseId}/contact-primary`,
  });
};
