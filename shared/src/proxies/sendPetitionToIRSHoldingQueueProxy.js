const { post } = require('./requests');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to send to the IRS holding queue
 * @returns {Promise<*>} the promise of the api call
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
