const { post } = require('../requests');

/**
 * updateOtherStatisticsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update statistics
 * @param {number} providers.damages damages statistic to add to the case
 * @param {number} providers.litigationCosts litigation costs statistic to add to the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateOtherStatisticsInteractor = (
  applicationContext,
  { damages, docketNumber, litigationCosts },
) => {
  return post({
    applicationContext,
    body: { damages, litigationCosts },
    endpoint: `/case-meta/${docketNumber}/other-statistics`,
  });
};
