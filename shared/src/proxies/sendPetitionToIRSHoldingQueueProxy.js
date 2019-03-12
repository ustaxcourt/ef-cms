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
    body: null, // TODO: why do we need to specify null?
    endpoint: `/cases/${caseId}/irsPetitionPackage`,
  });
};
