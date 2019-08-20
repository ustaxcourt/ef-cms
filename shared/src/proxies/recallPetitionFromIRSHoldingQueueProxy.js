const { remove } = require('./requests');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to recall
 * @returns {Promise<*>} the promise of the api call
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
