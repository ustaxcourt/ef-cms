const { post } = require('../requests');

/**
 * updateOtherStatisticsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update statistics
 * @param {number} providers.damages damages statistic to add to the case
 * @param {number} providers.litigationCosts litigation costs statistic to add to the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateOtherStatisticsInteractor = ({
  applicationContext,
  caseId,
  damages,
  litigationCosts,
}) => {
  return post({
    applicationContext,
    body: { damages, litigationCosts },
    endpoint: `/case-meta/${caseId}/other-statistics`,
  });
};
