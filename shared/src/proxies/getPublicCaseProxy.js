const { get } = require('./requests');

/**
 * getPublicCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number to get
 * @returns {Promise<*>} the promise of the api call
 */
exports.getPublicCaseInteractor = (applicationContext, { docketNumber }) => {
  return get({
    applicationContext,
    endpoint: `/public-api/cases/${docketNumber}`,
  });
};
