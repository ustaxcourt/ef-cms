const { post } = require('./requests');

/**
 * prioritizeCaseInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.reason the reason the case was set as high priority
 * @returns {Promise<*>} the promise of the api call
 */
exports.prioritizeCaseInteractor = (
  applicationContext,
  { docketNumber, reason },
) => {
  return post({
    applicationContext,
    body: { reason },
    endpoint: `/case-meta/${docketNumber}/high-priority`,
  });
};
