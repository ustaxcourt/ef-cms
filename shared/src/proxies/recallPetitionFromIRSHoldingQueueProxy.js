const { remove } = require('./requests');

/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.recallPetitionFromIRSHoldingQueue = ({
  caseId,
  applicationContext,
}) => {
  return remove({
    applicationContext,
    endpoint: `/cases/${caseId}/recallFromIRSHoldingQueue`,
  });
};
