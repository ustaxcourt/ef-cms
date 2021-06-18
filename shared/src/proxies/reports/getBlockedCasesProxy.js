const { get } = require('../requests');

/**
 * getBlockedCasesInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.trialLocation the trial location to filter the blocked cases by
 * @returns {Promise<*>} the promise of the api call
 */
exports.getBlockedCasesInteractor = (applicationContext, { trialLocation }) => {
  return get({
    applicationContext,
    endpoint: `/reports/blocked/${trialLocation}`,
  });
};
