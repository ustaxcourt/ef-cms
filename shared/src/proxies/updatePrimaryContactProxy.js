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
  caseId,
  contactInfo,
}) => {
  return put({
    applicationContext,
    body: { caseId, contactInfo },
    endpoint: `/cases/${caseId}/contact-primary`,
  });
};
