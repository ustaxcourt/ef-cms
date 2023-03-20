const { head } = require('./requests');

/**
 * getPublicCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {Promise<*>} the promise of the api call
 */
exports.getPublicCaseExistsInteractor = (
  applicationContext,
  { docketNumber },
) => {
  return head({
    applicationContext,
    endpoint: `/public-api/cases/${docketNumber}`,
  });
};
