const { remove } = require('./requests');

/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.recallPetitionFromIRSHoldingQueueInteractor = ({
  applicationContext,
  caseId,
}) => {
  return remove({
    applicationContext,
    endpoint: `/cases/${caseId}/recall-from-irs-holding-queue`,
  });
};
