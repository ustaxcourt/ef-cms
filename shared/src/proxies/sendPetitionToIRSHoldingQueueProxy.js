const { post } = require('./requests');

/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.sendPetitionToIRSHoldingQueue = ({ applicationContext, caseId }) => {
  return post({
    applicationContext,
    endpoint: `/cases/${caseId}/send-to-irs-holding-queue`,
  });
};
