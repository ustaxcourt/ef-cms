const { post } = require('./requests');

/**
 * blockCaseFromTrialInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.reason the reason the case was blocked
 * @returns {Promise<*>} the promise of the api call
 */
exports.blockCaseFromTrialInteractor = ({
  applicationContext,
  docketNumber,
  reason,
}) => {
  return post({
    applicationContext,
    body: { reason },
    endpoint: `/case-meta/${docketNumber}/block`,
  });
};
