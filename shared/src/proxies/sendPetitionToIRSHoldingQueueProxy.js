const { post } = require('./requests');

/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.sendPetitionToIRSHoldingQueueInteractor = ({
  applicationContext,
  caseId,
}) => {
  return post({
    applicationContext,
    endpoint: `/cases/${caseId}/send-to-irs-holding-queue`,
  });
};
