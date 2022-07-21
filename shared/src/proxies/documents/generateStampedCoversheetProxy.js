const { post } = require('../requests');

/**
 * generateStampedCoversheetInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @param {string} providers.docketEntryId the docket entry id
 * @returns {Promise<*>} the promise of the api call
 */
exports.generateStampedCoversheetInteractor = (
  applicationContext,
  { docketEntryId, docketNumber, stampData, stampedDocketEntryId },
) => {
  return post({
    applicationContext,
    body: {
      stampData,
      stampedDocketEntryId,
    },
    endpoint: `/case-documents/${docketNumber}/${docketEntryId}/stamped-coversheet`,
  });
};
