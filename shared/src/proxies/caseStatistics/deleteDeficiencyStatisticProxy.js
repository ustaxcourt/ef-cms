const { remove } = require('../requests');

/**
 * deleteDeficiencyStatisticInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update statistics
 * @param {number} providers.statisticIndex the index of the statistic to update
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteDeficiencyStatisticInteractor = ({
  applicationContext,
  caseId,
  statisticIndex,
}) => {
  return remove({
    applicationContext,
    endpoint: `/case-meta/${caseId}/statistics/${statisticIndex}`,
  });
};
