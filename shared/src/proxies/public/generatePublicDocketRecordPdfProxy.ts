const { post } = require('../requests');

/**
 * generatePublicDocketRecordPdfInteractor (proxy)
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the case docket number
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePublicDocketRecordPdfInteractor = (
  applicationContext,
  { docketNumber },
) => {
  return post({
    applicationContext,
    body: {
      docketNumber,
    },
    endpoint: `/public-api/cases/${docketNumber}/generate-docket-record`,
  });
};
