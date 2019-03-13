const { post } = require('./requests');

/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.sendPetitionToIRSHoldingQueue = ({ caseId, applicationContext }) => {
  return post({
    applicationContext,
    endpoint: `/cases/${caseId}/irsPetitionPackage`,
  });
};
